import {Editor } from '@tinymce/tinymce-react';
import {Controller } from 'react-hook-form';
import conf from './conf/conf';


export default function RTE({name, control, label, defaultValue =""}) {
  return (
    <div className='w-full'> 
    {label && <label className='inline-block mb-1 pl-1 text-slate-800 dark:text-slate-200'>{label}</label>}

{/* // HW: Study about controller */}
    <Controller
    name={name || "content"}
    control={control}
    render={({field: {onChange, value}}) => (
        <Editor
        apiKey={conf.apiKey}
        initialValue={defaultValue}
        value={value || ""}
        init={{
            initialValue: defaultValue,
            height: 500,
            menubar: true,
            plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
            ],
            directionality: "ltr",
            toolbar:
            "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
            content_style: "body { direction: ltr; unicode-bidi: normal; text-align: left; font-family: Helvetica, Arial, sans-serif; font-size: 14px; }",
            setup: (editor) => {
                editor.on("init", () => {
                    editor.getBody().setAttribute("dir", "ltr")
                })
            },
        }}
        onEditorChange={onChange}
        />
    )}
    />

     </div>
  )
}
