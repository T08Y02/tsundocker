import {useForm} from 'react-hook-form'
import axios from "axios"
import { useRouter } from "next/router";
import { useState } from 'react';
import {Link, Input, Button, Textarea, Image} from '@nextui-org/react'
import { useAuth0 } from "@auth0/auth0-react";
import Layout from '../../../../components/Layout';

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
    const {getAccessTokenSilently, isAuthenticated} = useAuth0();
    const [progress, setProgress] = useState({
        percentage: post.progress
    });

    const changeProgress = (e) => {
        let value = e.target.value
        //console.log(value)
        setProgress({...progress, percentage: value})
    }
    

    const onSubmit = async data => {
      const result = window.confirm('投稿を編集しますか？');
        if(result){
          const formData = new FormData();
          formData.append("title", data.title);
          formData.append("body", data.body);
          formData.append("image", data.image[0]);
          formData.append("progress", data.progress);

          //PUTメソッドを利用する
          formData.append('_method', 'put');
          const token = await getAccessTokenSilently({
            authorizationParams: {
            audience: `https://dev-48dl2vm3b3mgcs87.us.auth0.com/api/v2/`,
            },
          });
          for (let value of formData.entries()) { 
            console.log(value); 
          }
          console.log("token:", token); 
          const res = await fetch(`http://localhost/api/posts/${post.uuid}/edit`, {
          //実質的にはPUTなのだが、PUTだとbodyが送れないのでここの記載はPOSTにしている。
          //formdataの_methodをPUTにしておけばPUTリクエストが送信できているらしく、api側のルーティングもPUTで処理できている
              method: 'POST',
              mode: 'cors',
            
              headers: {
                Authorization: "Bearer " + token
                //'Content-Type': 'application/json'
                //'Content-Type': formData
              },
              
              //body: JSON.stringify({ data }),
              body : formData, 
          })

          const post_id = await res.json();
          alert(`投稿を${post_id}番の投稿として編集しました`);
          await router.push(`/posts/create`);
          await router.push('/posts');

      }
    }

      return (
        <Layout>
          <div className="p-10">
            <div className="ml-10 p-10 bg-white text-black rounded-lg">
              <div className="flex flex-row ">
                <div className="p-10">
                    <Image
                              alt="Card background"
                              className="object-cover rounded-xl"
                              src={post.img_url}
                              width={1200}
                              />
                </div>
                <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data' className=" w-full">
                    <div className = 'p-5'>
                        <label htmlFor="first">Title:</label>
                        <Input type="text" size={`lg`} color="primary" isRequired defaultValue={post.title} {...register("title")} />
                    </div>
                  
                    <div className = 'p-5'>
                        <label htmlFor="last">Body:</label>
                        <Textarea type="textarea" size={`lg`} clearButton color="primary" isRequired defaultValue={post.body} {...register("body")}/>
                    </div>
                    <div className = 'p-5 text-black'>
                      <output id="output1">{progress.percentage}</output>
                      <Input type="range"  value={progress.percentage} name="progress" min="0" max="100" step="1"  onInput={(e) => changeProgress(e)} {...register("progress")} />
                    </div>
                    <div className = 'p-5'>
                      <Input
                      color="primary"
                      type="file"
                      accept="image/*"
                      {...register("image")}/>
                    </div>
                  
                    <div className = 'input_submit p-5'>
                        <Button type="submit" color="primary" variant="solid" size='lg'>
                          投稿編集
                        </Button>
                    </div>
                    <div className="p-5">
                      <div className = 'back'>
                          <Button href="/posts" as={Link} color="primary" variant="faded">
                            戻る
                          </Button>
                      </div>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </Layout>

    )
}

  
// この関数はビルド時に呼ばれる
export async function getStaticPaths() {
    // 記事を取得する外部APIのエンドポイントをコール
    const res = await fetch('http://172.24.0.7/api/posts');
    const posts = await res.json();
  
    // 記事にもとづいてプリレンダするパスを取得
    const paths = posts.map((post) => ({
      params: { uuid: post.uuid.toString() },
    }))
  
    // 設定したパスのみ、ビルド時にプリレンダ
    // { fallback: false } は、他のルートが404になるという意味
    return { paths, fallback: false };
}
  
 
  // この関数もビルド時に呼ばれる
  export async function getStaticProps({ params }) {
    // `params`は`id`の記事内容を含む
    // ルートが/posts/1とすると、params.idは1となる
    const res = await fetch(`http://172.24.0.7/api/posts/${params.uuid}`);
    const post_and_uuid = await res.json();
    //const post = {"title":"happy", "body" : "lucky"}
  
    // propsを通じてpostをページに渡す
    return { props: { post_and_uuid } };
  }
  
  
export default Edit;