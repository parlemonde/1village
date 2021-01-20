import { useRouter } from "next/router";
import qs from "query-string";
import React from "react";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";

import { KeepRatio } from "src/components/KeepRatio";
import { UserContext } from "src/contexts/userContext";
import Logo from "src/svg/logo.svg";

type User = {
  username: string;
  password: string;
  remember: boolean;
};

const errorMessages = {
  0: "Une erreur inconnue est survenue. Veuillez réessayer plus tard...",
  1: "Adresse e-mail ou pseudo invalide.",
  2: "Mot de passe invalide.",
  3: "Compte bloqué, trop de tentatives de connexion. Veuillez réinitialiser votre mot de passe.",
};

const Login: React.FC = () => {
  const router = useRouter();
  const { login } = React.useContext(UserContext);
  const redirect = React.useRef<string>("/");

  const [user, setUser] = React.useState<User>({
    username: "",
    password: "",
    remember: false,
  });
  const [errorCode, setErrorCode] = React.useState(-1);

  React.useEffect(() => {
    try {
      redirect.current = decodeURI((qs.parse(window.location.search).redirect as string) || "/");
    } catch (e) {
      redirect.current = "/";
    }
  }, []);

  const updateUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((u) => ({ ...u, username: e.target.value }));
    if (errorCode === 1) {
      setErrorCode(-1);
    }
  };
  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((u) => ({ ...u, password: e.target.value }));
    if (errorCode === 1) {
      setErrorCode(-1);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await login(user.username, user.password, user.remember);
    if (response.success) {
      router.push(redirect.current);
    } else {
      setErrorCode(response.errorCode || 0);
    }
  };

  return (
    <div className="bg-gradiant">
      <KeepRatio ratio={0.45} width="95%" maxWidth="1200px" minHeight="500px" className="login__container">
        <div className="login__panel">
          <form onSubmit={onSubmit} className="login__form">
            <div className="flex-center" style={{ marginBottom: "0.8rem" }}>
              <Logo style={{ width: "2.6rem", height: "auto" }} />
              <h1 className="title" style={{ margin: "0 0 0 0.5rem" }}>
                1Village
              </h1>
            </div>
            <p style={{ marginBottom: "2rem" }}>Se connecter</p>
            {(errorCode === 0 || errorCode === 3) && (
              <p className="text text--small text--error text-center" style={{ margin: "0 0 1rem 0" }}>
                {errorMessages[errorCode]}
              </p>
            )}
            <TextField
              label="Adresse email"
              placeholder="Entrez votre adresse email"
              name="username"
              value={user.username}
              fullWidth
              onChange={updateUsername}
              style={{ marginBottom: "1.5rem" }}
              error={errorCode === 1}
              helperText={errorCode === 1 ? errorMessages[1] : null}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              name="password"
              type="password"
              value={user.password}
              fullWidth
              onChange={updatePassword}
              style={{ marginBottom: "1.5rem" }}
              error={errorCode === 2}
              helperText={errorCode === 2 ? errorMessages[2] : null}
              InputLabelProps={{ shrink: true }}
            />
            <div className="full-width">
              <FormControlLabel
                label="Se souvenir de moi"
                style={{ marginBottom: "1.5rem", cursor: "pointer" }}
                control={
                  <Checkbox
                    color="primary"
                    checked={user.remember}
                    onChange={() => {
                      setUser((u) => ({ ...u, remember: !u.remember }));
                    }}
                  />
                }
              />
            </div>

            <div className="text-center" style={{ marginBottom: "1rem" }}>
              <Button type="submit" color="primary" variant="outlined">
                Se connecter
              </Button>
            </div>
            <div className="text-center">
              <a className="text text--small text--primary">Mot de passe oublié ?</a>
            </div>
          </form>
        </div>
        <div className="login__panel login__panel--with-blue-background">
          <img src="/family_values_best_friends.png" width="90%" height="auto" style={{ maxWidth: "600px" }} />
        </div>
      </KeepRatio>
    </div>
  );
};

export default Login;
