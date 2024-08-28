import React, {useEffect} from "react";
import { FileImport } from "../admin/FileImport";
import { ChangeListRequest } from "../request/ChangeListRequest";
import axios from "axios";
import { getExclusionInterface } from "../admin/ExclusionWordAdd";
import { Container } from "react-bootstrap";
import {backendAddress} from "../util";
import {parseUserJson, User} from "../request/User";
import {useNavigate} from "react-router-dom";

/**
 * Represents the Admin page component.
 * @component
 */
const Admin: React.FC = () => {

  const navigate = useNavigate();


  let user: User
  let userRaw = localStorage.getItem("user");
  if (userRaw) {
    user = parseUserJson(userRaw);
  }

  useEffect(() => {
    if(!userRaw){
      navigate("/")
    }
  }, []);


  /**
   * Submits a change list request to the server.
   * @param file The change list request.
   */
  const submitChangeList = (file: ChangeListRequest) => {
    file.user = user
    axios.post(backendAddress() + "wordchange", file).then();
  };

  return (
    <div>
      <header>
        <h1>Admin Page</h1>
      </header>
      <div>
        {/* add spacer */}
        <div style={{ height: "150px" }}></div>
        <div>
          <FileImport disabled={false} submitChangeList={submitChangeList} />
        </div>
        <Container>
          <div style={{ height: "100px" }}></div>
          <div>
            <>{getExclusionInterface()}</>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Admin;
