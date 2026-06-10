import type { User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentReference,
  type DocumentData,
  type QueryConstraint,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/react-app/lib/firebase";

type CurrentUserGetter = () => User | null;
type Row = Record<string, unknown>;

const collectionNames = {
  staff: "staff_users",
  departments: "departments",
  articles: "cms_articles",
  announcements: "cms_announcements",
  projects: "cms_projects",
  marriages: "marriage_applications",
  serviceRequests: "service_requests",
  auditLogs: "audit_logs",
  statusHistory: "status_history",
  staffByUid: "staff_by_uid",
  publicMarriageTracking: "public_marriage_tracking",
  publicServiceTracking: "public_service_tracking",
};

let installed = false;

export function installApiFetchShim(getCurrentUser: CurrentUserGetter) {
  if (installed || typeof window === "undefined") {
    return;
  }

  installed = true;
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : null;
    const rawUrl = request?.url || input.toString();
    const url = new URL(rawUrl, window.location.origin);

    if (url.origin === window.location.origin && url.pathname.startsWith("/api/")) {
      return handleApiRequest(url, init || request || {}, getCurrentUser);
    }

    return originalFetch(input, init);
  };
}

async function handleApiRequest(url: URL, init: RequestInit | Request, getCurrentUser: CurrentUserGetter) {
  try {
    const method = getMethod(init);
    const path = url.pathname;
    const body = await readBody(init);

    if (path === "/api/logout") {
      return jsonResponse({ success: true });
    }

    if (path === "/api/users/me" && method === "GET") {
      const user = requireUser(getCurrentUser);
      return jsonResponse(await currentUserPayload(user));
    }

    if (path === "/api/staff/register" && method === "POST") {
      const user = requireUser(getCurrentUser);
      const existing = await getStaffForUser(user.uid);
      if (existing) return jsonResponse({ error: "User already registered" }, 400);

      const role = "citizen";
      const staffId = await addRow(collectionNames.staff, {
        mocha_user_id: user.uid,
        email: user.email || "",
        full_name: body.full_name || user.displayName || "",
        phone: body.phone || "",
        role,
        job_title: "",
        is_active: 1,
      });
      await setStaffRoleMirror({
        id: Number.isFinite(Number(staffId)) ? Number(staffId) : staffId,
        mocha_user_id: user.uid,
        email: user.email || "",
        full_name: body.full_name || user.displayName || "",
        role,
        is_active: 1,
      });
      return jsonResponse({
        success: true,
        role,
        message: "Registration successful",
      }, 201);
    }

    if (path === "/api/staff" && method === "GET") {
      await requireRole(getCurrentUser, ["super_admin", "chairman", "lcda_secretary"]);
      return jsonResponse(await listRows(collectionNames.staff, [orderBy("created_at", "desc")]));
    }

    const staffRoleMatch = path.match(/^\/api\/staff\/([^/]+)\/role$/);
    if (staffRoleMatch && method === "PATCH") {
      await requireRole(getCurrentUser, ["super_admin"]);
      const validRoles = ["super_admin", "chairman", "lcda_secretary", "hod", "department_staff", "digital_champion", "citizen"];
      if (!validRoles.includes(String(body.role))) return jsonResponse({ error: "Invalid role" }, 400);
      await patchRow(collectionNames.staff, staffRoleMatch[1], {
        role: body.role,
        department_id: body.department_id || null,
        job_title: body.job_title || "",
      });
      const updatedStaff = await getRow(collectionNames.staff, staffRoleMatch[1]);
      if (updatedStaff) await setStaffRoleMirror(updatedStaff);
      return jsonResponse({ success: true });
    }

    if (path === "/api/departments" && method === "GET") {
      return jsonResponse(await listRows(collectionNames.departments, [orderBy("name")]));
    }

    const cmsResult = await handleCms(path, method, body, getCurrentUser);
    if (cmsResult) return cmsResult;

    const publicResult = await handlePublic(path, method, body);
    if (publicResult) return publicResult;

    const marriageResult = await handleMarriage(path, method, url, body, getCurrentUser);
    if (marriageResult) return marriageResult;

    const serviceResult = await handleServiceRequests(path, method, body, getCurrentUser);
    if (serviceResult) return serviceResult;

    return jsonResponse({ error: `No Firebase API handler for ${method} ${path}` }, 404);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Unexpected error";
    return jsonResponse({ error: message }, status);
  }
}

async function handleCms(path: string, method: string, body: Row, getCurrentUser: CurrentUserGetter) {
  const specs = [
    { segment: "articles", collectionName: collectionNames.articles, joinName: "author_name" },
    { segment: "announcements", collectionName: collectionNames.announcements, joinName: "author_name" },
    { segment: "projects", collectionName: collectionNames.projects, joinName: "author_name" },
  ];

  for (const spec of specs) {
    const listPath = `/api/cms/${spec.segment}`;
    const itemMatch = path.match(new RegExp(`^/api/cms/${spec.segment}/([^/]+)$`));

    if (path === listPath && method === "GET") {
      await requireCmsRole(getCurrentUser);
      return jsonResponse(await withAuthorNames(await listRows(spec.collectionName, [orderBy("created_at", "desc")])));
    }

    if (path === listPath && method === "POST") {
      const staff = await requireCmsRole(getCurrentUser);
      const id = await createCmsRow(spec.segment, spec.collectionName, body, Number(staff.id));
      return jsonResponse({ success: true, id }, 201);
    }

    if (itemMatch && method === "GET") {
      await requireCmsRole(getCurrentUser);
      const row = await getRow(spec.collectionName, itemMatch[1]);
      if (!row) return jsonResponse({ error: `${singular(spec.segment)} not found` }, 404);
      const hydrated = (await withAuthorNames([row]))[0];
      return jsonResponse(spec.segment === "announcements" ? { announcement: hydrated } : hydrated);
    }

    if (itemMatch && method === "PATCH") {
      await requireCmsRole(getCurrentUser);
      const row = await getRow(spec.collectionName, itemMatch[1]);
      if (!row) return jsonResponse({ error: `${singular(spec.segment)} not found` }, 404);
      await patchRow(spec.collectionName, itemMatch[1], cmsPatch(spec.segment, body, row));
      return jsonResponse({ success: true });
    }

    if (itemMatch && method === "DELETE") {
      await requireCmsRole(getCurrentUser);
      await deleteDoc(doc(db, spec.collectionName, itemMatch[1]));
      return jsonResponse({ success: true });
    }
  }

  return null;
}

async function handlePublic(path: string, method: string, body: Row) {
  if (path === "/api/public/articles" && method === "GET") {
    const rows = sortRows(await listRows(collectionNames.articles, [where("status", "==", "published")]), "published_at", "desc").slice(0, 20);
    return jsonResponse(rows.map((row) => pick(row, ["id", "title", "slug", "excerpt", "featured_image", "category", "tags", "published_at", "views"])));
  }

  if (path === "/api/public/announcements" && method === "GET") {
    const now = new Date().toISOString();
    const rows = sortRows(await listRows(collectionNames.announcements, [where("status", "==", "published")]), "created_at", "desc");
    return jsonResponse(rows
      .filter((row) => (!row.starts_at || String(row.starts_at) <= now) && (!row.expires_at || String(row.expires_at) >= now))
      .map((row) => pick(row, ["id", "title", "content", "type", "priority", "starts_at", "expires_at"])));
  }

  if (path === "/api/public/projects" && method === "GET") {
    const rows = sortRows(await listRows(collectionNames.projects), "created_at", "desc");
    return jsonResponse(rows.map((row) => pick(row, [
      "id", "title", "slug", "description", "category", "status", "location_name", "location_lat",
      "location_lng", "budget", "spent", "progress", "contractor", "start_date", "end_date", "featured_image",
    ])));
  }

  if (path === "/api/public/marriage-applications" && method === "POST") {
    if (!body.groom_surname || !body.groom_first_name || !body.groom_dob || !body.groom_address || !body.groom_phone) {
      return jsonResponse({ error: "Groom details are required" }, 400);
    }
    if (!body.bride_surname || !body.bride_first_name || !body.bride_dob || !body.bride_address || !body.bride_phone) {
      return jsonResponse({ error: "Bride details are required" }, 400);
    }
    const applicationNumber = generateCode("MAR");
    const marriageId = await addRow(collectionNames.marriages, {
      ...body,
      application_number: applicationNumber,
      status: "submitted",
      fee_amount: 5000,
      fee_paid: 0,
      submitted_at: new Date().toISOString(),
    });
    const marriage = await getRow(collectionNames.marriages, marriageId);
    if (marriage) await setPublicMarriageTracking(marriage);
    return jsonResponse({
      success: true,
      applicationNumber,
      message: "Your marriage certificate application has been submitted successfully. Please save your application number for tracking.",
    }, 201);
  }

  const marriageTrack = path.match(/^\/api\/public\/marriage-applications\/([^/]+)$/);
  if (marriageTrack && method === "GET") {
    const row = await getRow(collectionNames.publicMarriageTracking, decodeURIComponent(marriageTrack[1]));
    if (!row) return jsonResponse({ error: "Application not found" }, 404);
    return jsonResponse(row);
  }

  return null;
}

async function handleMarriage(path: string, method: string, url: URL, body: Row, getCurrentUser: CurrentUserGetter) {
  if (path === "/api/marriage-applications" && method === "GET") {
    await requireRole(getCurrentUser, ["super_admin", "chairman", "lcda_secretary", "hod", "department_staff"]);
    const status = url.searchParams.get("status");
    const constraints: QueryConstraint[] = status && status !== "all" ? [where("status", "==", status)] : [];
    return jsonResponse(sortRows(await listRows(collectionNames.marriages, constraints), "submitted_at", "desc"));
  }

  const match = path.match(/^\/api\/marriage-applications\/([^/]+)$/);
  if (!match) return null;

  if (method === "GET") {
    await requireRole(getCurrentUser, ["super_admin", "chairman", "lcda_secretary", "hod", "department_staff"]);
    const row = await getRow(collectionNames.marriages, match[1]);
    if (!row) return jsonResponse({ error: "Application not found" }, 404);
    return jsonResponse(row);
  }

  if (method === "PATCH") {
    const staff = await requireRole(getCurrentUser, ["super_admin", "chairman", "lcda_secretary", "hod", "department_staff"]);
    const row = await getRow(collectionNames.marriages, match[1]);
    if (!row) return jsonResponse({ error: "Application not found" }, 404);
    const valid = ["submitted", "under_review", "pending_payment", "payment_verified", "approved", "certificate_issued", "rejected"];
    if (body.status && !valid.includes(String(body.status))) return jsonResponse({ error: "Invalid status" }, 400);

    const patch: Row = { updated_at: new Date().toISOString() };
    for (const key of ["status", "review_notes", "rejection_reason", "fee_paid", "payment_reference"]) {
      if (body[key] !== undefined) patch[key] = body[key];
    }
    if (body.status === "under_review") Object.assign(patch, { reviewed_at: new Date().toISOString(), reviewed_by: staff.id });
    if (body.status === "approved") Object.assign(patch, { approved_at: new Date().toISOString(), approved_by: staff.id });
    if (body.status === "certificate_issued") {
      Object.assign(patch, { certificate_issued_at: new Date().toISOString(), issued_by: staff.id, certificate_number: generateCode("CERT") });
    }
    if (body.payment_reference !== undefined) patch.payment_date = new Date().toISOString();
    await patchRow(collectionNames.marriages, match[1], patch);
    const updated = await getRow(collectionNames.marriages, match[1]);
    if (updated) await setPublicMarriageTracking(updated);
    await addAudit(Number(staff.id), `marriage_application_${body.status || "updated"}`, "marriage_application", match[1], { status: body.status, notes: body.review_notes });
    return jsonResponse({ success: true });
  }

  return null;
}

async function handleServiceRequests(path: string, method: string, body: Row, getCurrentUser: CurrentUserGetter) {
  if (path === "/api/service-requests" && method === "GET") {
    await requireServiceRequestRole(getCurrentUser);
    const [requests, departments, staff] = await Promise.all([
      listRows(collectionNames.serviceRequests),
      listRows(collectionNames.departments),
      listRows(collectionNames.staff),
    ]);
    return jsonResponse({ requests: sortRows(requests, "created_at", "desc").map((row) => hydrateServiceRequest(row, departments, staff)) });
  }

  if (path === "/api/service-requests" && method === "POST") {
    if (!body.service_type || !body.citizen_name || !body.citizen_phone) return jsonResponse({ error: "Missing required fields" }, 400);
    const trackingNumber = generateCode("SR");
    const id = await addRow(collectionNames.serviceRequests, {
      tracking_number: trackingNumber,
      service_type: body.service_type,
      citizen_name: body.citizen_name,
      citizen_email: body.citizen_email || null,
      citizen_phone: body.citizen_phone,
      citizen_address: body.citizen_address || null,
      description: body.description || null,
      priority: body.priority || "normal",
      status: "pending",
      submitted_at: new Date().toISOString(),
    });
    await addRow(collectionNames.statusHistory, {
      request_id: id,
      request_type: "service_request",
      tracking_number: trackingNumber,
      old_status: null,
      new_status: "pending",
      notes: "Request submitted by citizen",
    });
    const request = await getRow(collectionNames.serviceRequests, id);
    if (request) await setPublicServiceTracking(request, [{
      request_id: id,
      request_type: "service_request",
      tracking_number: trackingNumber,
      old_status: null,
      new_status: "pending",
      notes: "Request submitted by citizen",
      created_at: new Date().toISOString(),
    }]);
    return jsonResponse({ success: true, tracking_number: trackingNumber }, 201);
  }

  const trackMatch = path.match(/^\/api\/service-requests\/track\/([^/]+)$/);
  if (trackMatch && method === "GET") {
    const trackingNumber = decodeURIComponent(trackMatch[1]);
    const tracking = await getRow(collectionNames.publicServiceTracking, trackingNumber);
    if (!tracking) return jsonResponse({ error: "Request not found" }, 404);
    return jsonResponse(tracking);
  }

  const itemMatch = path.match(/^\/api\/service-requests\/([^/]+)$/);
  if (!itemMatch) return null;

  if (method === "GET") {
    await requireServiceRequestRole(getCurrentUser);
    const [request, departments, staff] = await Promise.all([
      getRow(collectionNames.serviceRequests, itemMatch[1]),
      listRows(collectionNames.departments),
      listRows(collectionNames.staff),
    ]);
    if (!request) return jsonResponse({ error: "Request not found" }, 404);
    return jsonResponse({ request: hydrateServiceRequest(request, departments, staff) });
  }

  if (method === "PATCH") {
    const staffUser = await requireServiceRequestRole(getCurrentUser);
    const request = await getRow(collectionNames.serviceRequests, itemMatch[1]);
    if (!request) return jsonResponse({ error: "Request not found" }, 404);
    const valid = ["pending", "in_progress", "awaiting_documents", "completed", "rejected", "cancelled"];
    if (body.status && !valid.includes(String(body.status))) return jsonResponse({ error: "Invalid status" }, 400);
    const patch: Row = { updated_at: new Date().toISOString() };
    for (const key of ["status", "priority", "assigned_to", "department_id", "notes"]) {
      if (body[key] !== undefined) patch[key] = body[key];
    }
    if (body.status === "completed") patch.resolved_at = new Date().toISOString();
    await patchRow(collectionNames.serviceRequests, itemMatch[1], patch);
    await addAudit(Number(staffUser.id), `service_request_${body.status || "updated"}`, "service_request", itemMatch[1], { status: body.status, notes: body.notes });
    if (body.status && body.status !== request.status) {
      await addRow(collectionNames.statusHistory, {
        request_id: itemMatch[1],
        request_type: "service_request",
        tracking_number: request.tracking_number,
        old_status: request.status,
        new_status: body.status,
        changed_by: staffUser.id,
        notes: body.notes || null,
      });
    }
    const updatedRequest = await getRow(collectionNames.serviceRequests, itemMatch[1]);
    if (updatedRequest) {
      const history = sortRows(await listRows(collectionNames.statusHistory, [where("tracking_number", "==", updatedRequest.tracking_number)]), "created_at", "asc");
      const staff = await listRows(collectionNames.staff);
      await setPublicServiceTracking(updatedRequest, history.map((row) => ({
        ...row,
        changed_by_name: staff.find((item) => item.id === row.changed_by)?.full_name || null,
      })));
    }
    return jsonResponse({ success: true });
  }

  return null;
}

async function createCmsRow(segment: string, collectionName: string, body: Row, authorId: number) {
  if (segment === "articles") {
    return addRow(collectionName, {
      title: body.title,
      slug: body.slug || slugify(String(body.title || "")),
      excerpt: body.excerpt || "",
      content: body.content || "",
      featured_image: body.featured_image || "",
      category: body.category || "",
      tags: body.tags || "",
      status: body.status || "draft",
      is_featured: body.is_featured ? 1 : 0,
      author_id: authorId,
      published_at: body.status === "published" ? new Date().toISOString() : null,
      views: 0,
    });
  }

  if (segment === "announcements") {
    return addRow(collectionName, {
      title: body.title,
      content: body.content || "",
      type: body.type || "notice",
      priority: body.priority || "normal",
      status: body.status || "draft",
      starts_at: body.starts_at || null,
      expires_at: body.expires_at || null,
      author_id: authorId,
    });
  }

  return addRow(collectionName, {
    title: body.title,
    slug: body.slug || slugify(String(body.title || "")),
    description: body.description || "",
    category: body.category || "",
    status: body.status || "planned",
    location_name: body.location_name || "",
    location_lat: body.location_lat || null,
    location_lng: body.location_lng || null,
    budget: body.budget || 0,
    spent: body.spent || 0,
    progress: body.progress || 0,
    contractor: body.contractor || "",
    start_date: body.start_date || null,
    end_date: body.end_date || null,
    featured_image: body.featured_image || "",
    gallery: body.gallery || "",
    author_id: authorId,
  });
}

function cmsPatch(segment: string, body: Row, current: Row) {
  const patch: Row = { updated_at: new Date().toISOString() };
  const fields = segment === "articles"
    ? ["title", "slug", "excerpt", "content", "featured_image", "category", "tags", "status", "is_featured"]
    : segment === "announcements"
      ? ["title", "content", "type", "priority", "status", "starts_at", "expires_at"]
      : ["title", "slug", "description", "category", "status", "location_name", "location_lat", "location_lng", "budget", "spent", "progress", "contractor", "start_date", "end_date", "featured_image", "gallery"];

  for (const field of fields) {
    if (body[field] !== undefined) patch[field] = field === "is_featured" ? (body[field] ? 1 : 0) : body[field];
  }

  if (segment === "articles" && body.status === "published" && current.status !== "published") {
    patch.published_at = new Date().toISOString();
  }

  return patch;
}

async function currentUserPayload(user: User) {
  const staffProfile = await getStaffForUser(user.uid);
  return {
    id: user.uid,
    uid: user.uid,
    email: user.email || "",
    google_user_data: {
      name: user.displayName,
      given_name: user.displayName?.split(" ")[0] || null,
      family_name: user.displayName?.split(" ").slice(1).join(" ") || null,
      email: user.email,
      email_verified: user.emailVerified,
      picture: user.photoURL,
    },
    staffProfile,
  };
}

async function getStaffForUser(uid: string) {
  const mirror = await getRow(collectionNames.staffByUid, uid);
  if (!mirror) return null;

  const staffId = mirror.staff_user_id;
  const staff = staffId == null ? null : await getRow(collectionNames.staff, String(staffId));
  return staff || {
    id: staffId,
    mocha_user_id: uid,
    email: mirror.email,
    full_name: mirror.full_name,
    role: mirror.role,
    department_id: mirror.department_id,
    job_title: mirror.job_title,
    is_active: mirror.is_active ? 1 : 0,
  };
}

async function setStaffRoleMirror(staff: Row) {
  const uid = String(staff.mocha_user_id || "");
  if (!uid) return;
  await setDoc(doc(db, collectionNames.staffByUid, uid), {
    staff_user_id: staff.id,
    email: staff.email || "",
    full_name: staff.full_name || "",
    role: staff.role || "citizen",
    department_id: staff.department_id || null,
    job_title: staff.job_title || "",
    is_active: staff.is_active !== 0 && staff.is_active !== false,
    updated_at: new Date().toISOString(),
  }, { merge: true });
}

async function setPublicMarriageTracking(row: Row) {
  const applicationNumber = String(row.application_number || "");
  if (!applicationNumber) return;
  await setDoc(doc(db, collectionNames.publicMarriageTracking, applicationNumber), pickDefined(row, [
    "application_number", "status", "groom_first_name", "groom_surname", "bride_first_name", "bride_surname",
    "proposed_marriage_date", "fee_amount", "fee_paid", "submitted_at", "reviewed_at", "approved_at",
    "certificate_number", "certificate_issued_at", "rejection_reason",
  ]), { merge: true });
}

async function setPublicServiceTracking(row: Row, history: Row[]) {
  const trackingNumber = String(row.tracking_number || "");
  if (!trackingNumber) return;
  await setDoc(doc(db, collectionNames.publicServiceTracking, trackingNumber), {
    request: pickDefined(row, ["tracking_number", "service_type", "status", "priority", "submitted_at", "resolved_at"]),
    history,
    updated_at: new Date().toISOString(),
  }, { merge: true });
}

async function requireCmsRole(getCurrentUser: CurrentUserGetter) {
  return requireRole(getCurrentUser, ["super_admin", "chairman", "lcda_secretary", "hod", "digital_champion"]);
}

async function requireServiceRequestRole(getCurrentUser: CurrentUserGetter) {
  return requireRole(getCurrentUser, ["super_admin", "chairman", "lcda_secretary", "hod", "department_staff", "digital_champion"]);
}

async function requireRole(getCurrentUser: CurrentUserGetter, roles: string[]) {
  const user = requireUser(getCurrentUser);
  const staff = await getStaffForUser(user.uid);
  if (!staff || !roles.includes(String(staff.role))) {
    throw new ApiError("Unauthorized", 403);
  }
  return staff;
}

function requireUser(getCurrentUser: CurrentUserGetter) {
  const user = getCurrentUser();
  if (!user) throw new ApiError("Authentication required", 401);
  return user;
}

async function listRows(collectionName: string, constraints: QueryConstraint[] = []) {
  const snapshot = await getDocs(query(collection(db, collectionName), ...constraints));
  return snapshot.docs.map((item) => normalizeDoc(item.id, item.data()));
}

async function getRow(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(db, collectionName, id));
  return snapshot.exists() ? normalizeDoc(snapshot.id, snapshot.data()) : null;
}

async function addRow(collectionName: string, data: Row) {
  const explicitId = data.id == null ? null : String(data.id);
  const payload = {
    ...data,
    created_at: data.created_at || serverTimestamp(),
    updated_at: data.updated_at || serverTimestamp(),
  };
  let ref: DocumentReference<DocumentData>;

  if (explicitId) {
    ref = doc(db, collectionName, explicitId);
    await setDoc(ref, payload, { merge: true });
  } else {
    ref = doc(collection(db, collectionName));
    await setDoc(ref, {
      ...payload,
      id: ref.id,
    });
  }

  return ref.id;
}

async function patchRow(collectionName: string, id: unknown, data: Row) {
  const row = await resolveRowRef(collectionName, id);
  if (!row) throw new ApiError("Record not found", 404);
  await updateDoc(row.ref, { ...data, updated_at: data.updated_at || new Date().toISOString() });
}

async function resolveRowRef(collectionName: string, id: unknown) {
  const idString = String(id);
  const direct = doc(db, collectionName, idString);
  const directSnapshot = await getDoc(direct);
  if (directSnapshot.exists()) return { ref: direct, row: normalizeDoc(directSnapshot.id, directSnapshot.data()) };
  const snapshot = await getDocs(query(collection(db, collectionName), where("id", "==", Number(idString)), limit(1)));
  const first = snapshot.docs[0];
  return first ? { ref: first.ref, row: normalizeDoc(first.id, first.data()) } : null;
}

async function withAuthorNames(rows: Row[]) {
  const staff = await listRows(collectionNames.staff);
  return rows.map((row) => ({
    ...row,
    author_name: staff.find((item) => item.id === row.author_id)?.full_name || null,
  }));
}

function hydrateServiceRequest(row: Row, departments: Row[], staff: Row[]) {
  return {
    ...row,
    department_name: departments.find((item) => item.id === row.department_id)?.name || null,
    assigned_to_name: staff.find((item) => item.id === row.assigned_to)?.full_name || null,
  };
}

function sortRows(rows: Row[], field: string, direction: "asc" | "desc") {
  return [...rows].sort((left, right) => {
    const leftValue = String(left[field] || "");
    const rightValue = String(right[field] || "");
    return direction === "asc" ? leftValue.localeCompare(rightValue) : rightValue.localeCompare(leftValue);
  });
}

async function addAudit(userId: number, action: string, entityType: string, entityId: string, details: Row) {
  await addRow(collectionNames.auditLogs, {
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details: JSON.stringify(details),
  });
}

function normalizeDoc(id: string, data: DocumentData): Row {
  const row: Row = { id, ...data };
  for (const [key, value] of Object.entries(row)) {
    if (isTimestamp(value)) row[key] = value.toDate().toISOString();
  }
  return row;
}

function isTimestamp(value: unknown): value is Timestamp {
  return typeof value === "object" && value !== null && "toDate" in value && typeof (value as Timestamp).toDate === "function";
}

async function readBody(init: RequestInit | Request) {
  const method = getMethod(init);
  if (method === "GET" || method === "HEAD") return {};
  const body = init instanceof Request ? await init.clone().text() : init.body;
  if (!body) return {};
  if (typeof body === "string") return JSON.parse(body || "{}");
  return {};
}

function getMethod(init: RequestInit | Request) {
  return (init instanceof Request ? init.method : init.method || "GET").toUpperCase();
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function pick(row: Row, fields: string[]) {
  return Object.fromEntries(fields.map((field) => [field, row[field]]));
}

function pickDefined(row: Row, fields: string[]) {
  return Object.fromEntries(
    fields
      .filter((field) => row[field] !== undefined)
      .map((field) => [field, row[field]]),
  );
}

function singular(value: string) {
  return value.endsWith("s") ? value.slice(0, -1) : value;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function generateCode(prefix: string) {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${new Date().getFullYear()}-${random}`;
}

class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}
