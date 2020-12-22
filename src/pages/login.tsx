import { useRouter } from "next/router";
import qs from "query-string";
import React from "react";

import { UserServiceContext } from "src/contexts/userContext";

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
    <div>
      <h1>Login:</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username" style={{ marginRight: "1rem" }}>
            Username
          </label>
          <input id="username" name="username" type="text" value={user.username} onChange={updateUsername} />
        </div>
        <br />
        <div>
          <label htmlFor="password" style={{ marginRight: "1rem" }}>
            Password
          </label>
          <input id="password" name="password" type="password" onChange={updatePassword} />
        </div>
        <br />
        <button>Login!</button>
      </form>
    </div>
  );
};

export default Login;
