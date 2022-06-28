import Layout from "@/layout";

export default {
  path: "/departments",
  component: Layout,
  children: [
    {
      name:'departments',
      path: "",
      component: () => import("@/views/departments"),
      meta: {
        title: "部门管理",
        icon:'tree'
      },
    },
  ],
};
