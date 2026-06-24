import { Landmark } from 'lucide-react';

interface OrgNode {
  title: string;
  level: 'executive' | 'management' | 'department' | 'unit';
}

const OrganogramBox = ({ title, level }: OrgNode) => {
  const styles = {
    executive: 'bg-gradient-to-br from-green-700 to-green-800 text-white border-green-900 shadow-lg',
    management: 'bg-gradient-to-br from-green-600 to-green-700 text-white border-green-800',
    department: 'bg-white border-green-600 text-green-800 hover:bg-green-50',
    unit: 'bg-green-50 border-green-400 text-green-700 hover:bg-green-100'
  };

  return (
    <div className={`px-3 py-2 rounded-lg border-2 text-center text-xs md:text-sm font-medium transition-all ${styles[level]}`}>
      {title}
    </div>
  );
};

export default function Organogram() {
  const departments: OrgNode[] = [
    { title: 'Head, Admin & Human Resource Dept.', level: 'department' },
    { title: 'Head, Finance & Accounts Dept.', level: 'department' },
    { title: 'Head, Works & Infrastructure Dept.', level: 'department' },
    { title: 'Head, Agric & Social Services Dept.', level: 'department' },
    { title: 'Head, Education & Library Services Dept.', level: 'department' },
    { title: 'Head, Planning, Budget, Research & Statistics Dept.', level: 'department' },
    { title: 'Head, WAPA Dept.', level: 'department' },
    { title: 'Head, Primary Healthcare Services Dept.', level: 'department' },
    { title: 'Head, Environmental Services Dept.', level: 'department' },
  ];

  const units: OrgNode[] = [
    { title: 'Head, Audit Unit', level: 'unit' },
    { title: 'Head, Legal Service Unit', level: 'unit' },
    { title: 'Head, Public Affairs Unit', level: 'unit' },
    { title: 'Head, Tourism Unit', level: 'unit' },
    { title: 'Head, ICT Unit', level: 'unit' },
    { title: 'Head, Procurement Unit', level: 'unit' },
    { title: 'Area Officers', level: 'unit' },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[900px] p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-800 text-white px-6 py-3 rounded-xl shadow-lg">
            <Landmark className="w-5 h-5" />
            <span className="font-bold text-lg">Lagos State Government Local Government/LCDA Organogram</span>
          </div>
        </div>

        {/* Executive Chairman */}
        <div className="flex flex-col items-center">
          <div className="w-64">
            <OrganogramBox title="EXECUTIVE CHAIRMAN" level="executive" />
          </div>
          
          {/* Vertical line down */}
          <div className="w-0.5 h-8 bg-green-600"></div>
          
          {/* Vice Chairman */}
          <div className="w-52">
            <OrganogramBox title="VICE CHAIRMAN" level="management" />
          </div>
          
          {/* Vertical line down */}
          <div className="w-0.5 h-8 bg-green-600"></div>
          
          {/* Administration split: SLG and Council Manager */}
          <div className="relative w-full max-w-4xl">
            {/* Horizontal line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-green-600"></div>
            
            <div className="flex justify-center items-start gap-8 pt-8 px-4">
              {/* SLG Branch */}
              <div className="flex flex-col items-center w-40">
                <div className="w-0.5 h-8 bg-green-600 -mt-8"></div>
                <OrganogramBox title="SLG" level="management" />
                <div className="w-0.5 h-6 bg-green-500"></div>
                <OrganogramBox title="SUPERVISORS" level="unit" />
              </div>
              
              {/* Council Manager Branch (Center) */}
              <div className="flex flex-col items-center flex-1 mx-4">
                <div className="w-0.5 h-8 bg-green-600 -mt-8"></div>
                <div className="w-56">
                  <OrganogramBox title="COUNCIL MANAGER" level="management" />
                </div>
                
                {/* Vertical line to departments */}
                <div className="w-0.5 h-8 bg-green-600"></div>
                
                {/* Departments Grid */}
                <div className="relative w-full">
                  {/* Horizontal line spanning departments */}
                  <div className="absolute top-0 left-8 right-8 h-0.5 bg-green-500"></div>
                  
                  <div className="grid grid-cols-3 gap-3 pt-6">
                    {departments.map((dept, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-0.5 h-4 bg-green-500 -mt-4"></div>
                        <OrganogramBox title={dept.title} level={dept.level} />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Units Section */}
                <div className="mt-6 w-full">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-0.5 flex-1 bg-green-400"></div>
                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wide px-3">Units</span>
                    <div className="h-0.5 flex-1 bg-green-400"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {units.map((unit, index) => (
                      <div key={index}>
                        <OrganogramBox title={unit.title} level={unit.level} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-green-700 to-green-800 border border-green-900"></div>
            <span className="text-muted-foreground">Executive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-green-600 to-green-700 border border-green-800"></div>
            <span className="text-muted-foreground">Management</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white border-2 border-green-600"></div>
            <span className="text-muted-foreground">Departments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-50 border-2 border-green-400"></div>
            <span className="text-muted-foreground">Units</span>
          </div>
        </div>
      </div>
    </div>
  );
}
