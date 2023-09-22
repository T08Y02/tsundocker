
import {useForm} from 'react-hook-form'
import axios from "axios"
import { useRouter } from "next/router";
import {Link, Input, Button, Textarea} from '@nextui-org/react'
import { useAuth0 } from "@auth0/auth0-react";



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
        //そもそもリクエストが届いていないっぽい。アドレスが悪いわけではない(稼働しているはずのindexも死んでいた)
        //const res = await axios.get('http://localhost/api/posts/create');
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
        console.log("token:", token); 
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

      }

      return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <div className="p-10 w-9/12">
          <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
              <div className = 'p-5 w-1/2'>
                  <label htmlFor="first">Title:</label>
                  <Input type="text" size={`lg`} color="primary" isRequired defaultValue="" {...register("title")} />
              </div>
            
              <div className = 'p-5'>
                  <label htmlFor="last">Body:</label>
                  <Textarea type="textarea" size={`lg`} clearButton color="primary" isRequired defaultValue="" {...register("body")}/>
              </div>
              <div>
                <Input
                color="primary"
                type="file"
                accept="image/*"
                {...register("image")}/>
              </div>


            
              <div className = 'input_submit pt-5 pb-5'>
                  <Button type="submit" color="primary" variant="solid">
                    投稿
                  </Button>
              </div>
              <div className="pt-5 pb-5">
                <div className = 'back'>
                    <Button href="/posts" as={Link} color="primary" variant="faded">
                      戻る
                    </Button>
                </div>
              </div>
          </form>
        </div>
    )
}

  
export default Create;

