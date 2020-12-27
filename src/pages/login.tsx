import classnames from "classnames";
import { useRouter } from "next/router";
import qs from "query-string";
import React from "react";

import { Button } from "src/components/Button";
import { Checkbox } from "src/components/Checkbox";
import { Input } from "src/components/Input";
import { KeepRatio } from "src/components/KeepRatio";
import { UserServiceContext } from "src/contexts/userContext";
import styles from "src/styles/login.module.scss";
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
  const { login } = React.useContext(UserServiceContext);
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
      <KeepRatio ratio={0.45} width="95%" maxWidth="1200px" className={styles.LoginContainer}>
        <div className={styles.LoginPanel} style={{ overflow: "scroll" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "0.8em" }}>
            <Logo style={{ width: "2.6em", height: "auto" }} />
            <h1 className="title" style={{ marginLeft: "0.5em" }}>
              1 Village
            </h1>
          </div>
          <p style={{ marginBottom: "3em" }}>Se connecter</p>
          <form onSubmit={onSubmit} style={{ width: "95%", maxWidth: "300px" }}>
            {(errorCode === 0 || errorCode === 3) && (
              <p className="less text-alert text-center" style={{ marginBottom: "1em" }}>
                {errorMessages[errorCode]}
              </p>
            )}
            <Input
              label="Adresse email"
              placeholder="Entrez votre adresse email"
              name="username"
              value={user.username}
              fullWidth
              onChange={updateUsername}
              style={{ marginBottom: "1.5em" }}
              error={errorCode === 1}
              helperText={errorCode === 1 ? errorMessages[1] : null}
            />
            <Input
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              name="password"
              type="password"
              value={user.password}
              fullWidth
              onChange={updatePassword}
              style={{ marginBottom: "1.5em" }}
              error={errorCode === 2}
              helperText={errorCode === 2 ? errorMessages[2] : null}
            />
            <Checkbox
              label="Se souvenir de moi"
              color="primary"
              style={{ marginBottom: "1.5em" }}
              isChecked={user.remember}
              onToggle={() => {
                setUser((u) => ({ ...u, remember: !u.remember }));
              }}
            />
            <div style={{ width: "100%", textAlign: "center", marginBottom: "1em" }}>
              <Button type="submit" color="primary" variant="inverted">
                Se connecter
              </Button>
            </div>
            <div style={{ width: "100%", textAlign: "center" }}>
              <a className="small text-primary">Mot de passe oublié ?</a>
            </div>
          </form>
        </div>
        <div className={classnames(styles.LoginPanel, styles["LoginPanel--blue"])}>
          <img src="/family_values_best_friends.png" width="90%" height="auto" style={{ maxWidth: "600px" }} />
        </div>
      </KeepRatio>
    </div>
  );
};

export default Login;
