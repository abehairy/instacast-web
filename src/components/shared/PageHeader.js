import { useAuth0 } from "@auth0/auth0-react";


export default function PageHeader(props) {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div></div>;
  }

  return (
    <>
      {(props.showHeader &&
        <section class="py-4 bg-gray bg-gradient-purple-left text-white overflow-hidden">
          <div class="container px-4 mx-auto">
            <h1 class="font-heading mb-1 text-2xl font-semibold">Hey
              {isAuthenticated && user && (
                <span> {user.given_name}</span>
                // <div>
                //   <img src={user.picture} alt={user.name} />
                //   <h2>Welcome, {user.name}</h2>
                // </div>
              )}
              {/* Your layout content */}
              👋</h1>
            <p class="text-sm text-white">Here's your lifegraph update</p>
          </div>
        </section>
      )}

      <section className="py-4 bg-white overflow-hidden">
        <div className="container px-4 mx-auto">
          {props.backTo && (
            <a className="flex flex-wrap items-center mb-2 text-neutral-500 hover:text-neutral-600" href="#">
              <svg className="mr-3.5" width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.13634 11.197C5.42923 11.4899 5.9041 11.4899 6.197 11.197C6.48989 10.9041 6.48989 10.4292 6.197 10.1363L5.13634 11.197ZM1 6.00001L0.46967 5.46968C0.329018 5.61033 0.25 5.8011 0.25 6.00001C0.25 6.19892 0.329018 6.38969 0.46967 6.53034L1 6.00001ZM6.197 1.86367C6.48989 1.57078 6.48989 1.09591 6.197 0.803013C5.9041 0.51012 5.42923 0.51012 5.13634 0.803013L6.197 1.86367ZM13 6.75001C13.4142 6.75001 13.75 6.41422 13.75 6.00001C13.75 5.5858 13.4142 5.25001 13 5.25001V6.75001ZM6.197 10.1363L1.53033 5.46968L0.46967 6.53034L5.13634 11.197L6.197 10.1363ZM1.53033 6.53034L6.197 1.86367L5.13634 0.803013L0.46967 5.46968L1.53033 6.53034ZM1 6.75001L13 6.75001V5.25001L1 5.25001L1 6.75001Z" fill="currentColor"></path>
              </svg><span>Back to Home</span></a>
          )}
          <h1 className="font-heading mb-1 text-2xl font-semibold">
            {
              props.icon && (
                <img style={{ 'display': 'inline', 'marginRight': '10px' }} width={'25'} src={`/dashy-assets/images/${props.icon}`} />
              )
            }
            {props.title || 'Page Header'}</h1>
          <small class="text-neutral-700">{props.description}</small>
          {props.children}
        </div>
      </section>
    </>

  )
}
