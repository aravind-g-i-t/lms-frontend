const AdminDashboard = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-teal-700">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-teal-50 p-6 rounded-xl border border-teal-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-teal-800">
              Welcome to Admin Panel
            </h2>
            <p className="text-teal-700 text-sm">
              Select any section from the sidebar to manage your platform's content and users.
            </p>
          </div>
          {/* You can add more dashboard cards here, e.g. stats, quick links, etc. */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
