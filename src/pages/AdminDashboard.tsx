import { useState } from "react";

export default function AdminDashboard() {

  const [complaints] = useState([
    {
      id: 101,
      name: "John Doe",
      location: "Market Road",
      description: "Pothole near college gate",
      priority: "High",
      status: "Pending"
    },
    {
      id: 102,
      name: "Alice",
      location: "Sector 5",
      description: "Streetlight not working",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: 103,
      name: "Rahul",
      location: "MG Road",
      description: "Garbage pile not cleared",
      priority: "High",
      status: "Resolved"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* Stats Section */}

      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
          <h2>Total Complaints</h2>
          <p className="text-2xl">{complaints.length}</p>
        </div>

        <div className="bg-red-500 text-white p-6 rounded-xl shadow">
          <h2>High Priority</h2>
          <p className="text-2xl">
            {complaints.filter(c => c.priority === "High").length}
          </p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl shadow">
          <h2>Resolved</h2>
          <p className="text-2xl">
            {complaints.filter(c => c.status === "Resolved").length}
          </p>
        </div>

      </div>

      {/* Complaint Table */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Complaint List
        </h2>

        <table className="w-full border">

          <thead className="bg-gray-200">

            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Location</th>
              <th className="p-3">Complaint</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
            </tr>

          </thead>

          <tbody>

            {complaints.map((c) => (

              <tr key={c.id} className="border">

                <td className="p-3">{c.id}</td>
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.location}</td>
                <td className="p-3">{c.description}</td>

                <td className="p-3">

                  <span className={`px-3 py-1 rounded text-white ${
                    c.priority === "High"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}>
                    {c.priority}
                  </span>

                </td>

                <td className="p-3">{c.status}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}