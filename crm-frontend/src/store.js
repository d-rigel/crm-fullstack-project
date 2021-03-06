import { configureStore } from "@reduxjs/toolkit";
import ticketReducer from "./pages/ticket-list/ticketsSlice";
import loginReducer from "./component/login/login/loginSlice";
import userReducer from "./pages/dashboard/userSlice";
import newTicketReducer from "./component/add-ticket-form/addTicketSlice";
import registrationReducer from "./component/registration-form/userRegistrationSlice";
import passwordReducer from "./component/password.reset/resetPwSlice";

const store = configureStore({
  reducer: {
    tickets: ticketReducer,
    login: loginReducer,
    user: userReducer,
    openTicket: newTicketReducer,
    registration: registrationReducer,
    password: passwordReducer,
  },
});

export default store;
