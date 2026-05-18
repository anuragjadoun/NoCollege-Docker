import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import API from "../services/api";

export default function AdminReports() {

  const [reports, setReports] = useState([]);

  useEffect(() => {

    fetchReports();

  }, []);

  const fetchReports = async () => {

    try {

      const res = await API.get(
        "/report/all"
      );

      setReports(res.data);

    } catch (err) {

      alert(
        "Failed to load reports ❌"
      );
    }
  };

  return (

    <div className="

      min-h-screen

      bg-gradient-to-r
      from-purple-600
      via-pink-500
      to-purple-700

      dark:from-[#0f172a]
      dark:via-[#111827]
      dark:to-black

      text-white
    ">

      <Navbar />

      <div className="

        max-w-5xl
        mx-auto

        p-8
      ">

        <h1 className="

          text-5xl
          font-extrabold

          mb-10
        ">
          🚨 User Reports
        </h1>

        <div className="space-y-6">

          {
            reports.map((report) => (

              <div

                key={report.id}

                className="

                  bg-white/20
                  dark:bg-white/5

                  backdrop-blur-xl

                  p-6

                  rounded-3xl

                  shadow-2xl

                  border
                  border-white/10
                "
              >

                <p className="text-xl font-bold">
                  🚨 Reason:
                  {" "}
                  {report.reason}
                </p>

                <p className="mt-3">
                  👤 Reported User:
                  {" "}
                  {report.reportedUserEmail}
                </p>

                <p className="mt-2">
                  🕵️ Reporter:
                  {" "}
                  {report.reporterEmail}
                </p>

                <p className="mt-2">
                  📄 Message:
                  {" "}
                  {report.message}
                </p>

                <p className="mt-2">
                  📌 Status:
                  {" "}
                  {report.status}
                </p>

                <p className="mt-2 text-sm text-white/70">
                  ⏰
                  {" "}
                  {report.createdAt}
                </p>

                <div className="flex flex-wrap gap-4 mt-5">

  {/* RESOLVE REPORT */}

  <button

    onClick={async () => {

      try {

        await API.delete(

          `/report/${report.id}`
        );

        fetchReports();

      } catch (err) {

        alert(
          "Failed to remove report ❌"
        );
      }
    }}

    className="

      px-6
      py-2

      rounded-2xl

      bg-green-500
      hover:bg-green-600

      text-white

      font-bold

      transition-all
      duration-300

      hover:scale-105
    "
  >
    ✅ Resolve Report
  </button>

  {/* TEMP BAN */}

  <button

    onClick={async () => {

      try {

        await API.post(

          `/report/temp-ban/${report.reportedUserEmail}`
        );

        alert(
          "User temporarily banned ⛔"
        );

      } catch (err) {

        alert(
          "Failed to ban user ❌"
        );
      }
    }}

    className="

      px-6
      py-2

      rounded-2xl

      bg-yellow-500
      hover:bg-yellow-600

      text-black

      font-bold

      transition-all
      duration-300

      hover:scale-105
    "
  >
    ⛔ Temporary Ban
  </button>

  {/* PERMANENT DELETE */}

  <button

    onClick={async () => {

      const confirmDelete = window.confirm(

        "Are you sure?\n\nThis will permanently delete the user 💀"
      );

      if (!confirmDelete) return;

      try {

        await API.delete(

          `/report/permanent-delete/${report.reportedUserEmail}`
        );

        alert(
          "User permanently deleted 💀"
        );

        fetchReports();

      } catch (err) {

        alert(
          "Failed to delete user ❌"
        );
      }
    }}

    className="

      px-6
      py-2

      rounded-2xl

      bg-red-700
      hover:bg-red-800

      text-white

      font-bold

      transition-all
      duration-300

      hover:scale-105
    "
  >
    💀 Permanent Delete
  </button>

</div>

              </div>
            ))
          }

        </div>

      </div>

    </div>
  );
}