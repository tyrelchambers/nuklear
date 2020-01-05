  
import { observable, action, decorate, toJS } from 'mobx';
import { isEmpty } from '../helpers/isEmpty';

class InboxStore {
  messages = []
  selectedMessage = {}
  latestAfter = ""
  openChatWindow = false

  setMessages(data) {
    this.messages = [...this.messages, ...data.data];
    this.latestAfter = data.after;
  }

  getMessages() {
    return toJS(this.messages);
  }

  setOpenChatWindow(boolean) {
    this.openChatWindow = boolean;
  }

  setSelectedMessage(data) {
    this.selectedMessage = data.data;
  }

  getSelectedMessage() {
    return isEmpty(this.selectedMessage) ? null : this.selectedMessage;
  }
}

decorate(InboxStore, {
  messages: observable,
  setMessages: action,
  selectedMessage: observable,
  setSelectedMessage: action,
  latestAfter: observable,
  openChatWindow: observable
});

export default new InboxStore();