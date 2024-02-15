// Layouts
import { ManageLayout, ProfileLayout, HeaderOnly, FooterOnly } from "../components/Layout";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import JobList from "../pages/JobList";
import Profile from "~/pages/Profile";
import JobDetail from "~/pages/JobDetail";
import ChangePassword from "~/pages/ChangePassword";
import CreateRecruitment from "~/pages/CreateRecruitment";
import ManageJobs from "~/pages/ManageJobs";
import ListJobApply from "~/pages/ListJobApply";
import JobDetailAssigner from "~/pages/JobDetailAssigner";
import JobDetailSeeker from "~/pages/JobDetailSeeker";
import ListCandidate from "~/pages/ListCandidate";
import ForgotPassword from "~/pages/ForgotPassword";
import ResetPassword from "~/pages/ResetPassword";
import Deposit from "~/pages/Deposit";
import Withdraw from "~/pages/Withdraw";
import DepositHistory from "~/pages/DepositHistory";
import TransactionHistory from "~/pages/TransactionHistory";
import ComfirmMail from "~/pages/ComfirmMail";

import Dashboard from "~/pages/Admin/Dashboard";
import ManageSkill from "~/pages/Admin/ManageSkill";
import ManageCategorySkill from "~/pages/Admin/ManageCategorySkill";
import ManageCategoryJob from "~/pages/Admin/ManageCategoryJob";
import ManageJob from "~/pages/Admin/ManageJob";
import ManageStaff from "~/pages/Admin/ManageStaffs";
import ManageReportCustomer from "~/pages/Admin/ManageReportCustomer";
import ManageCustomer from "~/pages/Admin/ManageCustomer";
import ManagementOfPostingPost from "~/pages/Admin/ManagementOfPostingPost";
import DepositManagement from "~/pages/Admin/DepositManagement";
import MoneyWithDrawalManagement from "~/pages/Admin/MoneyWithDrawalManagement";
import ManagerRefundMoney from "~/pages/Admin/ManagerRefundMoney";
import AdminLogin from "~/pages/Admin/Login";
import ProfileUser from "~/pages/Admin/ProfileUser";
import LoginWithChat from "~/components/ChatBox/Login";
import ProfileCandidate from "~/pages/ProfileCandidate";
import Report from "~/pages/Report";

// Public routes
const publicRoutes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/signup", component: Signup },
    { path: "/forgotPassword", component: ForgotPassword },
    { path: "/resetPassword", component: ResetPassword },
    { path: "/jobs", component: JobList },
    { path: "/user/profile", component: Profile, layout: ProfileLayout },
    { path: "/job-detail", component: JobDetail },
    { path: "/job-detail-created", component: JobDetailAssigner },
    { path: "/job-detail-apply", component: JobDetailSeeker },
    { path: "/user/changepassword", component: ChangePassword, layout: ProfileLayout },
    { path: "/create-recruitment", component: CreateRecruitment },
    { path: "/manage-jobs", component: ManageJobs },
    { path: "/my-jobs-apply", component: ListJobApply },
    { path: "/list-cadidate-apply", component: ListCandidate },
    { path: "/login-with-chat", component: LoginWithChat, layout: HeaderOnly },
    { path: "/user/deposit", component: Deposit, layout: ProfileLayout },
    { path: "/user/withdraw", component: Withdraw, layout: ProfileLayout },
    { path: "/user/deposit-history", component: DepositHistory, layout: ProfileLayout },
    { path: "/user/transaction-history", component: TransactionHistory, layout: ProfileLayout },
    { path: "/ConfirmMail", component: ComfirmMail, layout: null },
    { path: "/profile-candidate/:id", component: ProfileCandidate },
    { path: "/report", component: Report },

    // Screen Admin
    { path: "/manage/dashboard", component: Dashboard, layout: ManageLayout },
    { path: "/manage/manage-skill", component: ManageSkill, layout: ManageLayout },
    { path: "/manage/manage-category-skill", component: ManageCategorySkill, layout: ManageLayout },
    { path: "/manage/manage-category-job", component: ManageCategoryJob, layout: ManageLayout },
    { path: "/manage/manage-staff", component: ManageStaff, layout: ManageLayout },
    { path: "/manage/manage-job", component: ManageJob, layout: ManageLayout },
    { path: "/manage/Manage-Report-Customer", component: ManageReportCustomer, layout: ManageLayout },
    { path: "/manage/Manage-Customer", component: ManageCustomer, layout: ManageLayout },
    { path: "/manage/login", component: AdminLogin, layout: FooterOnly },
    { path: "/manage/ManagementOfPostingPost", component: ManagementOfPostingPost, layout: ManageLayout },
    { path: "/manage/DepositManagement", component: DepositManagement, layout: ManageLayout },
    { path: "/manage/MoneyWithDrawalManagement", component: MoneyWithDrawalManagement, layout: ManageLayout },
    { path: "/manage/ManagerRefundMoney", component: ManagerRefundMoney, layout: ManageLayout },
    { path: "/manage/profile-user", component: ProfileUser, layout: ManageLayout },
];

// Private routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
