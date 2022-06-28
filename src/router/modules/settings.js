import Layout from "@/layout";

export default {
  path: "/settings",
  component: Layout,
  children: [
    {
      name:'settings',
      path: "",
      component: () => import("@/views/settings"),
      meta: {
        title: "公司设置",
        icon:'settings'
      },
    },
  ],
};
