import React from "react";

type User = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const [user, setUser] = React.useState<User>({
    username: "",
    password: "",
  });

  const updateUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((u) => ({ ...u, username: e.target.value }));
  };
  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((u) => ({ ...u, password: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // todo post login(user)
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
