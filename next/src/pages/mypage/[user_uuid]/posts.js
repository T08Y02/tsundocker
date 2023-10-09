import {Link, Button, Card, CardHeader, CardBody, CardFooter, Divider, Progress, Image, Spinner} from '@nextui-org/react'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import React, { useEffect, useState } from "react";
import {useAuth0} from "@auth0/auth0-react";
import Layout from '../../../../components/Layout';

// この関数はビルド時に呼ばれる
export async function getStaticProps({ params }) {
    // 投稿記事を取得する外部APIエンドポイントをコール
    const res = await fetch(`http://172.24.0.7/api/mypage/${params.user_uuid}/posts`);
    const posts = await res.json();
    const creator_uuid = params.user_uuid;
    //const posts = res;
  
    // { props: posts }を返すことで、ビルド時にBlogコンポーネントが
    // `posts`をpropとして受け取れる
    return {
      props: {
        posts,
        creator_uuid,
      },
    }
  }

  // この関数はビルド時に呼ばれる
  //todo : user_subを全取得してレンダリングする必要あり
export async function getStaticPaths() {
  // 記事を取得する外部APIのエンドポイントをコール
  const res = await fetch(`http://172.24.0.7/api/customUserUuids`);
  //const costomUserUuids = await res.json();
  const costomUsers = await res.json();

  // 記事にもとづいてプリレンダするパスを取得
  /*
  const paths = costomUserUuids.map((costomUserUuid) => ({
    params: { user_uuid: costomUserUuid.toString() },
  }))
  */
  
  const paths = costomUsers.map((costomUser) => ({
    params: { user_uuid: costomUser.uuid.toString() },
  }))
  

  // 設定したパスのみ、ビルド時にプリレンダ
  // { fallback: false } は、他のルートが404になるという意味
  return { paths, fallback: false };
}


export default withPageAuthRequired(function Posts({ posts, creator_uuid}) {
  const { user, error, isLoading } = useUser();
  const {getAccessTokenSilently, isAuthenticated} = useAuth0();
  const [loginUserNickname, setLoginUserNickname] = useState("username loading...");
  const [creatorNickname, setCreatorNickname] = useState("creator loading...");

  const getLoginuser = async () => {
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
      setLoginUserNickname(customuser['nickname']);
    }
    else{
      setLoginUserNickname(customuser);
    }

    
    //console.log(customuserNickname);
  }

  const getCreatorUser = async () => {
    
    const creator_res = await fetch('http://localhost/api/uuid2Nickname', {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
              },
              //body: JSON.stringify({ data }),
              body : JSON.stringify({
                "user_uuid" : creator_uuid,
              }), 
    });
    const creator_nickname = await creator_res.json();

    setCreatorNickname(creator_nickname);
    //console.log(customuserNickname);
  }


  getLoginuser();
  getCreatorUser();

  return(
    user && (
      <div>
        <Layout>
            <div>{creatorNickname}　さんの本棚</div>
            <div className="mt-5 mb-5">
              {(loginUserNickname==="username loading...")&&<Spinner/>}
              <div className="flex flex-row">
                <p>{loginUserNickname}</p>
                {(loginUserNickname!=="username loading...")&&<p>　でログインしています</p>}
              </div>
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
                        <Link href={`/posts/${encodeURIComponent(post.uuid)}`}>
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
            <div className="pl-10 pt-10 pb-10">
                  <Button href="/posts" as={Link} color="primary" variant="faded">
                    戻る
                  </Button>
            </div>
        </Layout>
      </div>
    )
  )
}

);