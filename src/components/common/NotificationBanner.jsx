const NotificationBanner = ({
  user,
  localTasksCount,
  onMigrationRequest,
  onSignUpRequest,
}) => {
  if (!localTasksCount && user) return null;

  return (
    <div className="bg-yellow-50 p-4 border-b border-yellow-100">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {!user ? (
          // Message for unauthenticated users
          <>
            <p className="text-yellow-700">
              Vos tâches sont actuellement stockées localement.{` `}
              <span className="font-medium">
                Connectez-vous pour les sauvegarder en ligne !
              </span>
            </p>
            <button
              onClick={onSignUpRequest}
              className="bg-yellow-100 hover:bg-yellow-200 px-4 py-2 rounded-md transition-colors"
            >
              S'inscrire gratuitement
            </button>
          </>
        ) : localTasksCount > 0 ? (
          // Message for authenticated users with local tasks
          <>
            <p className="text-yellow-700">
              <span className="font-medium">
                Vous avez {localTasksCount} tâche(s) stockée(s) localement.
              </span>{" "}
              Souhaitez-vous les transférer vers votre compte ?
            </p>
            <button
              onClick={onMigrationRequest}
              className="bg-yellow-100 hover:bg-yellow-200 px-4 py-2 rounded-md transition-colors"
            >
              Transférer mes tâches
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default NotificationBanner;
