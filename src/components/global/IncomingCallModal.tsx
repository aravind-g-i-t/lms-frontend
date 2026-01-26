import { useDirectCall } from "../../hooks/useDirectCall";

const IncomingCallModal = () => {
  const {
    incomingCall,
    activeCall,
    acceptCall,
    rejectCall,
  } = useDirectCall();

  return (
    <>
      {/* Incoming Call Modal */}
      {incomingCall && !activeCall && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-80">
            <h2 className="text-lg font-semibold mb-2">{`Incoming ${incomingCall.type==="audio"?"Audio":"Video"} Call`}</h2>
            <p className="text-sm text-gray-600 mb-4">
              From {incomingCall.callerRole}
            </p>

            <div className="flex gap-3">
              <button
                onClick={acceptCall}
                className="flex-1 bg-teal-600 text-white py-2 rounded-lg"
              >
                Accept
              </button>
              <button
                onClick={rejectCall}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IncomingCallModal;
