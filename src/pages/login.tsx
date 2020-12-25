import classnames from "classnames";
import { useRouter } from "next/router";
import qs from "query-string";
import React from "react";

import { KeepRatio } from "src/components/KeepRatio";
import { UserServiceContext } from "src/contexts/userContext";
import styles from "src/styles/login.module.scss";

type User = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const router = useRouter();
  const { login } = React.useContext(UserServiceContext);
  const redirect = React.useRef<string>("/");

  const [user, setUser] = React.useState<User>({
    username: "",
    password: "",
  });

  React.useEffect(() => {
    try {
      redirect.current = decodeURI((qs.parse(window.location.search).redirect as string) || "/");
    } catch (e) {
      redirect.current = "/";
    }
  }, []);

  const updateUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((u) => ({ ...u, username: e.target.value }));
  };
  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((u) => ({ ...u, password: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await login(user.username, user.password, false);
    if (response.success) {
      router.push(redirect.current);
    }
  };

  return (
    <div className="bg-gradiant">
      <KeepRatio ratio={0.3874} width="80%" maxWidth="1200px" className={styles.LoginContainer}>
        <div className={styles.LoginPanel}>
          <h1 className="title">1 Village</h1>
          <h3>Se connecter</h3>
          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor="username" style={{ marginRight: "1rem" }}>
                Adresse email
              </label>
              <input id="username" name="username" type="text" value={user.username} onChange={updateUsername} />
            </div>
            <br />
            <div>
              <label htmlFor="password" style={{ marginRight: "1rem" }}>
                Mot de passe
              </label>
              <input id="password" name="password" type="password" onChange={updatePassword} />
            </div>
            <br />
            <button>Se connecter</button>
          </form>
        </div>
        <div className={classnames(styles.LoginPanel, styles["LoginPanel--blue"])}></div>
      </KeepRatio>
    </div>
  );
};

export default Login;
