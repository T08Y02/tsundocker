import {Link, Button, Card, CardHeader, CardBody, CardFooter, Divider, Progress, Image} from '@nextui-org/react'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import React, { useEffect, useState } from "react";
import {useAuth0} from "@auth0/auth0-react";

// この関数はビルド時に呼ばれる
export async function getStaticProps() {
    // 投稿記事を取得する外部APIエンドポイントをコール
    const res = await fetch('http://172.24.0.7/api/posts');
    const posts = await res.json();
    //const posts = res;
  
    // { props: posts }を返すことで、ビルド時にBlogコンポーネントが
    // `posts`をpropとして受け取れる
    return {
      props: {
        posts
      },
    }
  }


  export default withPageAuthRequired(function Posts({ posts }) {
  const { user, error, isLoading } = useUser();
  const {getAccessTokenSilently, isAuthenticated} = useAuth0();
  const [customuserNickname, setCustomuserNickname] = useState("username loading...");

  const getCustomuser = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
      audience: `https://dev-48dl2vm3b3mgcs87.us.auth0.com/api/v2/`,
    }
    });

    const customuser_res = await fetch('http://localhost/api/getLoginCustomuser', {
              method: 'POST',
              mode: 'cors',
            
              headers: {
                Authorization: "Bearer " + token
                //'Content-Type': 'application/json'
                //'Content-Type': formData
              },
              
              //body: JSON.stringify({ data }),
              body : "null", 
    });
    const customuser = await customuser_res.json();
    //console.log(customuser['nickname']);
    if (typeof customuser['nickname'] !== "undefined"){
      setCustomuserNickname(customuser['nickname']);
    }
    else{
      setCustomuserNickname(customuser);
    }

    
    //console.log(customuserNickname);
  }

  getCustomuser();

  return(
    user && (
      <div className="p-10">
        <div>
          <p>{customuserNickname}</p>
          <p>{user.email}</p>
        </div>
        <div className="pb-10">
          <Button href="/posts/create" as={Link} color="primary"  variant="solid">
          新規投稿を作成
          </Button>
        </div>
        <div className="gap-6 grid grid-cols-2 sm:grid-cols-4">
        {posts.map((post) => (
          <div key={post.id}>
            
              <Card shadow="sm" isPressable className="w-full h-[200px]" >
                <Divider/>
                  <CardHeader className="overflow-visible p-0 ">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl h-[150px]"
                    src={post.img_url}
                    width={270}
                    />
                  </CardHeader>
                <Divider/>
                <CardBody className="overflow-visible p-0 ">
                    <Link href={`/posts/${encodeURIComponent(post.id)}`}>
                      {post.title}
                    </Link>
                </CardBody>
                <Divider/>
                <CardFooter>
                  <Progress max='100' min='0' value = {post.progress}></Progress>
                </CardFooter>
              </Card>
            </div>
        ))}
        </div>
      </div>
    )
  )
}

);