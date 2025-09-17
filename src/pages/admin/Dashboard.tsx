
const AdminDashboard = () => {
  return (
    <div>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-2">Welcome to Admin Panel</h2>
              <p className="text-muted-foreground">
                Select any section from the sidebar to manage your platform's content and users.
              </p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default AdminDashboard
