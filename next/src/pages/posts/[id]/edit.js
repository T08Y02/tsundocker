import Link from 'next/link'
import {useForm} from 'react-hook-form'
import axios from "axios"
import { useRouter } from "next/router";
import { useState } from 'react';

function Edit({ post_and_uuid }){
    const post = post_and_uuid.post;
    const creator_uuid = post_and_uuid.creator_uuid;
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();
    const router = useRouter();
    const [progress, setProgress] = useState({
        percentage: post.progress
    });

    const changeProgress = (e) => {
        let value = e.target.value
        //console.log(value)
        setProgress({...progress, percentage: value})
    }
    

    const onSubmit = async data => {
        console.log(data);
        
        //そもそもリクエストが届いていないっぽい。アドレスが悪いわけではない(稼働しているはずのindexも死んでいた)
        //const res = await axios.get('http://localhost/api/posts/create');
        const res = await fetch(`http://localhost/api/posts/${post.id}/edit`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data }),
          })
        const post_id = await res.json();
        alert(`投稿を${post_id}番の投稿として保存しました`);
        await router.push(`/posts/create`);
        await router.push('/posts');

      }

      return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <form onSubmit={handleSubmit(onSubmit)}>
             <div className = 'input_title'>
                <label htmlFor="first">Title:</label>
                <input defaultValue={post.title} {...register("title")} />
            </div>
           
            <div className = 'input_body'>
                <label htmlFor="last">Body:</label>
                <input defaultValue={post.body} {...register("body")} />
            </div>
            <input type="range"  value={progress.percentage} name="progress" min="0" max="100" step="1"  onInput={(e) => changeProgress(e)} {...register("progress")} />
            <output id="output1">{progress.percentage}</output>
            <div className = 'input_submit'>
                <input type="submit"/>
            </div>
        </form>
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
    //const post = {"title":"happy", "body" : "lucky"}
  
    // propsを通じてpostをページに渡す
    return { props: { post_and_uuid } };
  }
  
  
export default Edit;