import {  Avatar ,  Input , Comment, Form , Button } from 'antd';
const { TextArea } = Input;


interface EditorProps {
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: () => void;
    submitting: boolean;
    value: string;
  }

  interface UserType{id:string,username:string,email:string,profileImage:string}


  const Editor = ({ onChange, handleSubmit, submitting, value }: EditorProps) => (


    <>
      <Form.Item>
        <TextArea rows={4} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" loading={submitting} onClick={handleSubmit} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </>
  );


  interface CommentProp {
    avatar:string,
    alt:string,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: () => void;
    submitting: boolean;
    value: string;
    children?:React.ReactNode
  }

const CostumComment = ({avatar,alt , onChange, handleSubmit , submitting , value , children}:CommentProp) =>{
    return (
        <Comment
                              avatar={<Avatar src={avatar} alt={alt} />}
                              content={
                                <Editor
                                    onChange={onChange}
                                    handleSubmit={handleSubmit}
                                    submitting={submitting}
                                    value={value}
                                />
                              }
        >
            {children}
        </Comment>
    )
}




export default CostumComment;

