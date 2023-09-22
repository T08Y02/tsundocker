import { useUser } from '@auth0/nextjs-auth0/client';
import {Link} from '@nextui-org/react'

function Index() {
  const { user, error, isLoading } = useUser();
  if(typeof user === 'undefined'){
    console.log("not, Login");
  }else{
    //console.log(user);
    //console.log("sub=", user.sub);
  }

    return (
      <div>
       <p>{process.env.AUTH0_CLIENT_ID}</p>
        <p>Index</p>
        <div>
          <Link href="http://localhost:3000/posts">投稿一覧</Link>
        </div>
        <div>
          <Link href="http://localhost:3000/api/auth/login">Login</Link>
        </div>
        <div>
          <Link href="http://localhost:3000/api/auth/logout">Logout</Link>
        </div>
      </div>
      )
    
  }

  
export default Index;