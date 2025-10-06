
const FallbackUI = () => {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <svg
          className="w-12 h-12 text-red-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-gray-700">Unable to load data.</p>
        <p className="text-sm text-gray-500 mb-3">Please check your internet connection.</p>
        <button onClick={()=> window.location.reload()}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Retry
        </button>
      </div>
    );

}

export default FallbackUI
