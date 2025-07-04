import { IoMdNotificationsOff } from "react-icons/io";
export default function Reminder_And_FollowUp({ label }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-yellow-500 text-2xl">
            <IoMdNotificationsOff />
          </div>
          <h2 className="text-lg font-semibold ml-2">
            {label ? label : "Reminder & FollowUp"}
          </h2>
        </div>
        <div className="flex space-x-2">
          <div className="text-orange-600 text-3xl font-bold"></div>
        </div>
      </div>
      <div className="mt-2  border-2 border-blue-500 rounded-lg p-10 ">
        <div className="flex justify-between">
          <h3 className="text-sm text-gray-500">Today Reminder</h3>
          <p className="text-grey-600 text-lg font-bold">0</p>
        </div>

        <div className="flex justify-between ">
          <h3 className="text-purple-600 text-lg font-bold">Today Follow-up</h3>
          <p className="text-teal-600 text-lg font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
