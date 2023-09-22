import {Link, Progress, Image, Button} from '@nextui-org/react'
import {useForm} from 'react-hook-form'
import axios from "axios"
import { useRouter } from "next/router";
import {useAuth0} from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";


function Post({ post_and_uuid }){
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const post = post_and_uuid.post;
  const creator_uuid = post_and_uuid.creator_uuid;
  const [customuserNickname, setCustomuserNickname] = useState("username loading...");

  const getid2Nickname = async () => {
    
    const customuser_res = await fetch('http://localhost/api/uuid2Nickname', {
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
    const customuser_nickname = await customuser_res.json();

    setCustomuserNickname(customuser_nickname);
    //console.log(customuserNickname);
  }

  getid2Nickname();

  const postDelete = async data => {
    const result = await window.confirm('本当に投稿を削除しますか？');
    if(result){

      const res = await fetch(`http://localhost/api/posts/${encodeURIComponent(post.id)}/delete`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                },
              })
      alert('投稿を削除しました');
      await router.push('/posts');
    }
    else{
      alert('投稿を削除しませんでした');
    }

  }

    return (
      <div>
        <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src={post.img_url}
                  width={270}
                  />
        <h1>{post.title}</h1>
        <p>{post.body}</p>
        <p>creator : {customuserNickname}</p>
        <Progress max='100' min='0' value = {post.progress} className="pb-10 pt-10"></Progress>
        <div className="pb-10 pt-10">
          <Button href={`/posts/${encodeURIComponent(post.id)}/edit`} as={Link} color="primary"  variant="solid">
          編集
          </Button>
        </div>
  
        <form onSubmit={handleSubmit(postDelete)}>
          <Button type="submit" color="danger" variant="solid"> 削除</Button>
        </form>
        <div className="return">
          <Link href="/posts">
            戻る
          </Link>
        </div>
      </div>
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