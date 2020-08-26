import React, { useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import logo from "./logo.svg";
import "./App.css";
import "stream-chat-react/dist/css/index.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>This is the landing page, add appropriate content</p>
        <ChatWidget></ChatWidget>
      </header>
    </div>
  );
}

export default App;

function ChatWidget() {
  const [chatState, setChatState] = useState("WAIT"); // WAIT, JOIN, CHAT, SURVEY (no idea for LOAD at this point)
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);

  async function register(event) {
    event.preventDefault(); // stop processing of form submission
    const response = await fetch("http://localhost:8080/registrations", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
      }),
    });
    const { userId, token, channelId, apiKey } = await response.json();
    const chatClient = new StreamChat(apiKey);
    await chatClient.setUser(
      {
        id: userId,
        name: email,
        image: `https://getstream.io/random_svg/?id=${userId}`,
      },
      token
    );

    const channel = chatClient.channel("messaging", channelId);
    setChatClient(chatClient);
    setChannel(channel);
    setFirstName("");
    setLastName("");
    setEmail("");
    setChatState("CHAT");
  }

  if (chatState === "WAIT") {
    return (
      <div className="wait">
        <button className="waitbutton" onClick={() => setChatState("JOIN")}>
          ^
        </button>
      </div>
    );
  }

  if (chatState === "JOIN") {
    return (
      <div id="myModal" className="modal">
        <div className="modal-header" onClick={() => setChatState("WAIT")}><span className="close" >X
        <span className="tooltiptext">Return to wait</span></span>
        </div>
        <div className="modal-content">
          <div className="App container">
            <form className="card" onSubmit={register}>
              <label>First Name</label>
              <p>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="first name"
                  required
                />
              </p>
              <label>Last Name</label>
              <p>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="last name"
                  required
                />
              </p>
              <label>Email</label>
              <p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  required
                />
              </p>
              <button className="close" type="submit">Start chat</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  function startSurvey () {
    setChatState("SURVEY");
    setChannel(null);
    setChatClient(null);
  }

  if (chatState === "CHAT") {
    return (
      <div id="myModal" class="modal">
        {/* Modal content */}
        <div className="modal-content">
          <div className="modal-header" onClick={startSurvey}><span className="close" >X
        <span className="tooltiptext">Launch Survey</span>
          </span>
          </div>
          <div className="App">
            <Chat client={chatClient} theme={"messaging light"}>
              <Channel channel={channel}>
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            </Chat>
          </div>
        </div>
      </div>
    );
  }

  if (chatState === "SURVEY") {
    return (
      /*-- The Modal --*/
      <div id="myModal" className="modal">
        {/* Modal content */}
        <div className="modal-header" onClick={() => setChatState("WAIT")}><span className="close" >X
        <span className="tooltiptext">Return to wait</span>
        </span>
        </div>
        <div className="modal-content">
          <iframe
            id="surveylegend-survey"
            title="my survey"
            src="https://www.surveylegend.com/survey/#/d29yZHByZXNzMTE2NTky~-MF6VEjI4FTDLM06jlT4"
            width="90%"
            height="98%"
            allowtransparency="true"
            style={{
              // frameborder: 0,
              // border: 0,
              // margin: "0 auto",
              background: "transparent",
              backgroundColor: "transparent",
            }}
          ></iframe>
        </div>
      </div>
    );
  }

}
