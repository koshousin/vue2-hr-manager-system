import Layout from "@/layout";

export default {
  path: "/social_securitys",
  component: Layout,
  children: [
    {
      name: "social_securitys",
      path: "",
      component: () => import("@/views/social_securitys"),
      meta: {
        title: "社保管理",
        icon: "table",
      },
    },
  ],
};
