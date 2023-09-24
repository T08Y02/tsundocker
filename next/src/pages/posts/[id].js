import {Link, Progress, Image, Button} from '@nextui-org/react'
import {useForm} from 'react-hook-form'
import axios from "axios"
import { useRouter } from "next/router";
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import {useAuth0} from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import Layout from '../../../components/Layout';
import Create from './create';


function Post({ post_and_uuid }){
  const { user, error, isLoading } = useUser();
  const {getAccessTokenSilently, isAuthenticated} = useAuth0();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const post = post_and_uuid.post;
  const creator_uuid = post_and_uuid.creator_uuid;
  const [loginUserNickname, setLoginUserNickname] = useState("username loading...");
  const [creatorNickname, setCreatorNickname] = useState("username loading...");

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

  

  const postDelete = async data => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
      audience: `https://dev-48dl2vm3b3mgcs87.us.auth0.com/api/v2/`,
    }
    });

    const result = await window.confirm('本当に投稿を削除しますか？');
    if(result){
      const res = await fetch(`http://localhost/api/posts/${encodeURIComponent(post.id)}/delete`, {
                method: 'DELETE',
                headers: {
                  Authorization: "Bearer " + token,
                  'Content-Type': 'application/json',
                },
              })
      alert('投稿を削除しました');
      await router.push('/posts');
    }
    else{
      //alert('投稿を削除しませんでした');
    }

   
    

  }
  //run functions
  getLoginuser();
  getCreatorUser();

    return (
      user && (<Layout>
        <div className="p-10">
          <div className="ml-10 p-10 w-1/2 bg-slate-400 rounded-lg">
            <div className="p-10">
              <Image
                        alt="Card background"
                        className="object-cover rounded-xl"
                        src={post.img_url}
                        width={270}
                        />
            </div>
            <div className="w-6/12 ml-10 p-5 bg-white rounded-lg">
              <p className='text-black'>Title : {post.title}</p>
            </div>
            <div className="m-10 p-5 bg-white rounded-lg">
              <p className='text-black'>Body : {post.body}</p>
            </div>
            <div className="w-6/12 m-10 p-5 bg-white rounded-lg">
              <p className='text-black'>creator : {creatorNickname}</p>
            </div>
            <div className='p-10'>
              <Progress max='100' min='0' value = {post.progress} showValueLabel={true}></Progress>
            </div>
            <div className="pl-10 pb-10">
              {(loginUserNickname === creatorNickname) &&
              <Button href={`/posts/${encodeURIComponent(post.id)}/edit`} as={Link} size='lg' color="primary"  variant="solid">
                編集
              </Button>
              }
            </div>

            <div className="pl-10 pb-10">
              <form onSubmit={handleSubmit(postDelete)}>
                {(loginUserNickname === creatorNickname) &&
                <Button type="submit" color="danger" variant="solid"> 削除</Button>
                }
              </form>
            </div>
            <div className="pl-10 pb-10">
              <Button href="/posts" as={Link} color="primary" variant="faded">
                戻る
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    )
  )
}
  
// この関数はビルド時に呼ばれる
export async function getStaticPaths() {
    // 記事を取得する外部APIのエンドポイントをコール
    const res = await fetch('http://172.24.0.7/api/posts');
    const posts = await res.json();
  
    // 記事にもとづいてプリレンダするパスを取得
    const paths = posts.map((post) => ({
      params: { id: post.id.toString() },
    }))
  
    // 設定したパスのみ、ビルド時にプリレンダ
    // { fallback: false } は、他のルートが404になるという意味
    return { paths, fallback: false };
}
  
 
  // この関数もビルド時に呼ばれる
  export async function getStaticProps({ params }) {

    // `params`は`id`の記事内容を含む
    // ルートが/posts/1とすると、params.idは1となる
    const res = await fetch(`http://172.24.0.7/api/posts/${params.id}`);
    const post_and_uuid = await res.json();
    // propsを通じてpostをページに渡す
    return { props: { post_and_uuid} };
  }
  
  
  export default Post;