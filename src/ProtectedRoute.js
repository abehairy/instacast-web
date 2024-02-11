import { withAuthenticationRequired } from "@auth0/auth0-react";

const ProtectedRoute = ({ children }) => {
  const Component = withAuthenticationRequired(() => children);
  return <Component />;
};

export default ProtectedRoute;
