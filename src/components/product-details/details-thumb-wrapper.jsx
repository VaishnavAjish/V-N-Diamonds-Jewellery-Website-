import Image from "next/image";
import { useState } from "react";
import PopupVideo from "../common/popup-video";

const DetailsThumbWrapper = ({
  imageURLs,
  handleImageActive,
  activeImg,
  imgWidth = 416,
  imgHeight = 480,
  videoId = false,
  status
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  // when true, the main stage shows the video instead of the active image
  const [showVideo, setShowVideo] = useState(false);
  const isUrlVideo =
    typeof videoId === "string" &&
    (videoId.startsWith("http://") || videoId.startsWith("https://"));
  const videoPoster = imageURLs?.[0]?.img || activeImg;
  // de-duplicate identical image URLs so each photo shows only once
  const uniqueImages = imageURLs?.filter(
    (item, i, arr) => arr.findIndex((x) => x.img === item.img) === i
  );

  return (
    <>
      <div className="tp-product-details-thumb-wrapper tp-tab d-sm-flex">
        <nav>
          <div className="nav nav-tabs flex-sm-column">
            {/* image thumbnails */}
            {uniqueImages?.map((item, i) => (
              <button
                key={i}
                className={`nav-link ${!showVideo && item.img === activeImg ? "active" : ""}`}
                onClick={() => {
                  setShowVideo(false);
                  handleImageActive(item);
                }}
              >
                <Image
                  src={item.img}
                  alt="image"
                  width={78}
                  height={100}
                  style={{ width: "100%", height: "100%" }}
                  unoptimized={true}
                />
              </button>
            ))}

            {/* dedicated video thumbnail (only for direct video URLs) */}
            {isUrlVideo && (
              <button
                type="button"
                className={`nav-link ${showVideo ? "active" : ""}`}
                onClick={() => setShowVideo(true)}
                style={{ position: "relative" }}
              >
                <Image
                  src={videoPoster}
                  alt="video"
                  width={78}
                  height={100}
                  style={{ width: "100%", height: "100%" }}
                  unoptimized={true}
                />
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.35)",
                  }}
                >
                  <i className="fas fa-play" style={{ color: "#fff" }}></i>
                </span>
              </button>
            )}
          </div>
        </nav>
        <div className="tab-content m-img">
          <div className="tab-pane fade show active">
            <div className="tp-product-details-nav-main-thumb p-relative">
              {showVideo && isUrlVideo ? (
                <video
                  src={videoId}
                  controls
                  autoPlay
                  playsInline
                  style={{
                    width: imgWidth,
                    maxWidth: "100%",
                    height: imgHeight,
                    objectFit: "cover",
                    background: "#000",
                  }}
                />
              ) : (
                <>
                  <Image
                    src={activeImg}
                    alt="product img"
                    width={imgWidth}
                    height={imgHeight}
                  />
                  <div className="tp-product-badge">
                    {status === "out-of-stock" && (
                      <span className="product-hot">out-stock</span>
                    )}
                  </div>
                  {/* YouTube-style popup play button only for non-URL video ids */}
                  {videoId && !isUrlVideo && (
                    <div
                      onClick={() => setIsVideoOpen(true)}
                      className="tp-product-details-thumb-video"
                    >
                      <a className="tp-product-details-thumb-video-btn cursor-pointer popup-video">
                        <i className="fas fa-play"></i>
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* modal popup for YouTube-style ids only */}
      {videoId && !isUrlVideo && (
        <PopupVideo
          isVideoOpen={isVideoOpen}
          setIsVideoOpen={setIsVideoOpen}
          videoId={videoId}
        />
      )}
    </>
  );
};

export default DetailsThumbWrapper;
