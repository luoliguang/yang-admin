import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    icon?: string;
    affix?: boolean;
    hideMenu?: boolean;
    hideTab?: boolean;
  }
}
