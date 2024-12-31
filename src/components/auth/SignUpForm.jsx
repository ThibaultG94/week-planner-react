import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

const SignUpForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password);
      setSuccess(true);
      // onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Inscription réussie</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 text-green-600">
            <CheckCircle size={24} />
            <h3 className="text-lg font-medium">Compte créé avec succès !</h3>
          </div>

          <p className="text-gray-600 mb-4">
            Un email de confirmation a été envoyé à <span>{email}</span>.<br />
            Veuillez cliquer sur le lien dans l'email pour activer votre compte.
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez
            votre dossier spam.
          </p>

          <button
            onClick={onClose}
            type="button"
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Créer un compte</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
            <AlertTriangle size={16} />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmer le mot de passe"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Création du compte..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
