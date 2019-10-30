import React from 'react';
import {
   Form,
   Button
} from 'react-bootstrap';

class Setting extends React.Component {
   constructor(props) {
      super(props);

      this.state = {

      };
   }

   handleOnClick() {

   }

   render() {
      return (
         <div id="settings">
            <div className="container">
               <div className="row">
                  <div className="left col-md-6">
                     <div className="user">
                        <img className="user-img" src="" />
                     </div>
                     <div className="user-info">
                        <p className="profile-name">username</p>
                     </div>
                  </div>
                  <div className="col-md-6">
                     <Form>
                        <Form.Group>
                           <Form.Label>Username</Form.Label>
                           <Form.Control type="text" value="" />
                        </Form.Group>
                        <Form.Group>
                           <Form.Label>First Name</Form.Label>
                           <Form.Control type="text" value="" />
                        </Form.Group>
                        <Form.Group>
                           <Form.Label>Last Name</Form.Label>
                           <Form.Control type="text" value="" />
                        </Form.Group>
                        <Form.Group>
                           <Form.Label>Password</Form.Label>
                           <Form.Control type="password" value="" />
                        </Form.Group>
                        <div className="buttons">
                           <Button variant="info">Save Changes</Button>
                           <Button className="cancel" variant="danger">Cancel</Button>
                        </div>
                     </Form>
                  </div>
               </div>
            </div>
         </div>
      )
   }
}

export default Setting;
