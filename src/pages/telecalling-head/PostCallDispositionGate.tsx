import React from 'react';

export const PostCallDispositionGate: React.FC = () => {
  return (
    <main className=" mt-16 p-lg pointer-events-none opacity-40">
<div className="grid grid-cols-12 gap-lg">
<div className="col-span-8 space-y-lg">
<div className="h-64 w-full bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-center">
<p className="text-on-surface-variant">Detailed Partner Profile (Active Lead)</p>
</div>
<div className="h-96 w-full bg-surface-container-low rounded-xl border border-outline-variant"></div>
</div>
<div className="col-span-4 space-y-lg">
<div className="h-48 w-full bg-surface-container-low rounded-xl border border-outline-variant"></div>
<div className="h-[500px] w-full bg-surface-container-low rounded-xl border border-outline-variant"></div>
</div>
</div>
</main>
  );
};

export default PostCallDispositionGate;
