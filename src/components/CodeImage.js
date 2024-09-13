import { Input } from "antd";

function CodeImage () {
    return (
    <>  
    <Input size="small" className="mb-base" />
    <h3 className="font-heavy text-h1">Share Channel</h3>
    <div className="flex items-center justify-center">
        <img
            className="w-logo"
            src="/images/qr_placeholder.jpg"
            alt="Logo" />
    </div>
    </>
    );
}

export default CodeImage;