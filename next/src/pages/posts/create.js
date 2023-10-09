
import {useForm} from 'react-hook-form'
import axios from "axios"
import { useRouter } from "next/router";
import {Link, Input, Button, Textarea} from '@nextui-org/react'
import { useAuth0 } from "@auth0/auth0-react";
import Layout from '../../../components/Layout';


function Create() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();
    const router = useRouter();
    const {getAccessTokenSilently, isAuthenticated} = useAuth0();

    const onSubmit = async data => {
        const result = window.confirm('投稿を作成しますか？');
        if(result){
          const formData = new FormData();
          formData.append("title", data.title);
          formData.append("body", data.body);
          formData.append("image", data.image[0]);
          const token = await getAccessTokenSilently({
            authorizationParams: {
            audience: `https://dev-48dl2vm3b3mgcs87.us.auth0.com/api/v2/`,
            },
          });
          for (let value of formData.entries()) { 
            console.log(value); 
          }
          const res = await fetch('http://localhost/api/posts/create', {
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
    
          
          //console.log(res);
          const post_id = await res.json(); 
          //console.log(post_id);
                 
          alert(`投稿を${post_id}番の投稿として保存しました`);
          await router.push('/posts');

         
          await router.push('/posts');
        }

        else{
          alert('投稿を編集しませんでした');
        }

      }

      return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <Layout>
          <div className="p-10">
            <div className="ml-10 p-10 bg-white text-black rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
                <div className = 'p-5 w-1/2'>
                    <label htmlFor="first">Title:</label>
                    <Input type="text" size={`lg`} isRequired defaultValue="" color="primary" {...register("title")} />
                </div>
              
                <div className = 'p-5'>
                    <label htmlFor="last">Body:</label>
                    <Textarea type="textarea" size={`lg`} clearButton color="primary" isRequired defaultValue="" {...register("body")}/>
                </div>
                <div  className = 'p-5'>
                  <Input
                  color="primary"
                  type="file"
                  accept="image/*"
                  {...register("image")}/>
                </div>


              
                <div className = 'input_submit p-5'>
                    <Button type="submit" size='lg' color="primary" variant="solid">
                      投稿
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
        </Layout>
    )
}

  
export default Create;

