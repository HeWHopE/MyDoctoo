export const AngularWrapper = ({ path }: { path?: string }) => {
  // the following eslint and ts rules are disabled for the tag from angular
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  return <app-angular path={path}></app-angular>;
};
