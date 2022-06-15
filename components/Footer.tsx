type Props = {};
function Footer({}: Props) {
  return (
    <footer className="flex flex-col bg-slate-300">
      <div className="flex bg-darker border-t-[1px] border-slate-700 p-6">
        <div className="max-w-5xl m-auto">
          <div></div>
          Social media
        </div>
      </div>
      <div className="bg-dark p-10 pb-20">
        <div className="max-w-5xl m-auto flex flex-col items-center">
          <div>
            <p>Download chess and play online</p>
          </div>
          <div>Links gray</div>
          <div className="flex space-x-4">
            <p>Terms of Service</p>
            <p>Cookie Policy</p>
            <p>Privacy Policy</p>
            <p>Disclaimer</p>
          </div>
          <div>
            <p>
              &copy; choppychess.com | All rights reserved | Version: 1.0.41{" "}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
