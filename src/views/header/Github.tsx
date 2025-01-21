import { IconGithub } from "@arco-design/web-react/icon";

function Github() {
  return (
    <IconGithub
      onClick={() => openLink("https://github.com/abinzhao")}
      className="cursor-pointer text-2xl mr-4"
    />
  );
}

function openLink(url: string) {
  window.open(url);
}
export default Github;
