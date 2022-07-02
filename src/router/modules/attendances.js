import Layout from "@/layout";

export default {
  path: "/attendances",
  component: Layout,
  children: [
    {
      path: "",       // 默认路由
      name:'attendances',
      component: () => import("@/views/attendances"),
      meta: {
        title: "考勤管理",
        icon:'skill'
      },
    },
  ],
};
