import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../components/AdminSidebar";
import { fetchAllDoctors, deleteDoctorThunk } from "../../redux/slices/adminSlice";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDoctors = () => {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (doctors) {
      setFilteredDoctors(
        doctors.filter(
          (doctor) =>
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [doctors, searchTerm]);

  const handleDeleteClick = (doctor) => {
    setDeleteConfirmation(doctor);
  };

  const confirmDelete = async () => {
    if (deleteConfirmation) {
      try {
        await dispatch(deleteDoctorThunk(deleteConfirmation._id)).unwrap();
        toast.success(`Doctor ${deleteConfirmation.name} deleted successfully`);
        setDeleteConfirmation(null);
      } catch (error) {
        toast.error(`Failed to delete doctor: ${error}`);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  return (
    <div className="flex flex-col font-semibold md:flex-row h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      {!isMobile && <AdminSidebar />}

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Doctor Details</h1>
        </header>

        <main className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold">All Doctors</h2>
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search doctors..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No doctors found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 mr-10 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-9 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>

                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor._id}>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {doctor.profilePic ? (
                              <img
                                src={doctor.profilePic}
                                alt={doctor.name}
                                className="h-8 w-8 md:h-10 md:w-10 rounded-full mr-2 md:mr-3 object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold mr-2 md:mr-3 text-sm md:text-base">
                                {doctor.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="text-sm mr-12 md:text-base">{doctor.name}</div>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm md:text-base">{doctor.email}</td>

                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm md:text-base">{doctor.qualification}</td>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm md:text-base">{doctor.experience} years</td>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm md:text-base">{doctor.location}</td>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm md:text-base">{doctor.gender || "Not specified"}</td>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm md:text-base">
                          {new Date(doctor.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteClick(doctor)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <FiTrash2 className="mr-1" />
                            <span>Delete</span>
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {isMobile && <AdminSidebar />}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to permanently delete doctor <span className="font-bold">{deleteConfirmation.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;