import React, { useRef, useEffect } from 'react';
import ReviewForm from '../forms/review-form';
import ReviewItem from './review-item';

const DetailsTabNav = ({ product }) => {
  const {_id, description, additionalInformation, reviews, color, setting, parent, children, metalWgt, metalId, shape } = product || {};
  const activeRef = useRef(null)
  const marker = useRef(null);

  // Extract cert PDF from additionalInformation
  const certPdf = additionalInformation?.find(i => i.key?.toLowerCase() === 'cert pdf')?.value;
  // handleActive
  const handleActive = (e) => {
    if (e.target.classList.contains('active')) {
      marker.current.style.left = e.target.offsetLeft + "px";
      marker.current.style.width = e.target.offsetWidth + "px";
    }
  }
  useEffect(() => {
    if (activeRef.current?.classList.contains('active')) {
      marker.current.style.left = activeRef.current.offsetLeft + 'px';
      marker.current.style.width = activeRef.current.offsetWidth + 'px';
    }
  }, []);
  // nav item
  function NavItem({ active = false, id, title, linkRef }) {
    return (
      <button
        ref={linkRef}
        className={`nav-link ${active ? "active" : ""}`}
        id={`nav-${id}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#nav-${id}`}
        type="button"
        role="tab"
        aria-controls={`nav-${id}`}
        aria-selected={active ? "true" : "false"}
        tabIndex="-1"
        onClick={e => handleActive(e)}
      >
        {title}
      </button>
    );
  }

  return (
    <>
      <div className="tp-product-details-tab-nav tp-tab">
        <nav>
          <div className="nav nav-tabs justify-content-center p-relative tp-product-tab" id="navPresentationTab" role="tablist">
            <NavItem active={true} linkRef={activeRef} id="desc" title="Description" />
            <NavItem id="additional" title="Additional information" />
            {certPdf && <NavItem id="certificate" title="Certificate" />}
            <NavItem id="review" title={`Reviews (${reviews?.length || 0})`} />

            <span ref={marker} id="productTabMarker" className="tp-product-details-tab-line"></span>
          </div>
        </nav>
        <div className="tab-content" id="navPresentationTabContent">
          {/* nav-desc */}
          <div className="tab-pane fade show active" id="nav-desc" role="tabpanel" aria-labelledby="nav-desc-tab" tabIndex="-1">
            <div className="tp-product-details-desc-wrapper pt-60">
              <div className="row">
                <div className="col-xl-12">
                  <div className="tp-product-details-desc-item">
                    <div className="row align-items-center">
                      <div className="col-lg-12">
                        <div className="tp-product-details-desc-content">
                          <p>{description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* addInfo */}
          <div className="tab-pane fade" id="nav-additional" role="tabpanel" aria-labelledby="nav-additional-tab" tabIndex="-1">

            <div className="tp-product-details-additional-info ">
              <div className="row justify-content-center">
                <div className="col-xl-10">
                  <table>
                    <tbody>
                      <tr>
                        <td>Product</td>
                        <td>{product?.title || '-'}</td>
                      </tr>
                      <tr>
                        <td>Poetic Name</td>
                        <td>{additionalInformation?.find(i => i.key?.toLowerCase() === 'poetic name')?.value || '-'}</td>
                      </tr>
                      <tr>
                        <td>Lot Number</td>
                        <td>{product?.sku || '-'}</td>
                      </tr>
                      <tr>
                        <td>Description</td>
                        <td>{product?.description || '-'}</td>
                      </tr>
                      <tr>
                        <td>Metal</td>
                        <td>{additionalInformation?.find(i => i.key?.toLowerCase() === 'metal')?.value || '-'}</td>
                      </tr>
                      <tr>
                        <td>Metal gms</td>
                        <td>{additionalInformation?.find(i => i.key?.toLowerCase() === 'metal gms')?.value || '-'}</td>
                      </tr>
                      <tr>
                        <td>Diamond Pcs</td>
                        <td>{additionalInformation?.find(i => i.key?.toLowerCase() === 'diamond pcs')?.value || '-'}</td>
                      </tr>
                      <tr>
                        <td>Shape</td>
                        <td>{additionalInformation?.find(i => i.key?.toLowerCase() === 'shape')?.value || '-'}</td>
                      </tr>
                      <tr>
                        <td>Certificate</td>
                        <td>{additionalInformation?.find(i => i.key?.toLowerCase() === 'certificate')?.value || '-'}</td>
                      </tr>
                      <tr>
                        <td>Cert.No</td>
                        <td>{additionalInformation?.find(i => i.key?.toLowerCase() === 'cert.no' || i.key?.toLowerCase() === 'cert no')?.value || '-'}</td>
                      </tr>
                      <tr>
                        <td>Gross Gms</td>
                        <td>{additionalInformation?.find(i => i.key?.toLowerCase() === 'gross gms')?.value || '-'}</td>
                      </tr>


                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* Certificate PDF and Documents */}
          {(certPdf || (documents && documents.length > 0) || (links && links.length > 0)) && (
            <div className="tab-pane fade" id="nav-certificate" role="tabpanel" aria-labelledby="nav-certificate-tab" tabIndex="-1">
              <div className="tp-product-details-desc-wrapper pt-60">
                <div className="row justify-content-center">
                  <div className="col-xl-10 text-center">
                    {certPdf && (
                      <div className="mb-40">
                        <iframe
                          src={`${certPdf}#view=FitH`}
                          title="Product Certificate"
                          width="100%"
                          height="800px"
                          style={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <div className="mt-20">
                          <a href={certPdf} target="_blank" rel="noreferrer" className="tp-btn">Open PDF in New Tab</a>
                        </div>
                      </div>
                    )}
                    
                    {documents && documents.map((doc, index) => (
                      doc.url && (
                        <div key={index} className="mb-40">
                          <h4 className="mb-10">{doc.title || doc.type || 'Document'}</h4>
                          {doc.url.toLowerCase().endsWith('.pdf') ? (
                            <>
                              <iframe
                                src={`${doc.url}#view=FitH`}
                                title={doc.title || 'Document'}
                                width="100%"
                                height="800px"
                                style={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                              />
                              <div className="mt-20">
                                <a href={doc.url} target="_blank" rel="noreferrer" className="tp-btn">Open {doc.type || 'Document'} in New Tab</a>
                              </div>
                            </>
                          ) : (
                            <a href={doc.url} target="_blank" rel="noreferrer" className="tp-btn">View {doc.title || doc.type || 'Document'}</a>
                          )}
                        </div>
                      )
                    ))}

                    {links && links.map((link, index) => (
                      link.url && (
                        <div key={index} className="mb-40">
                          <h4 className="mb-10">{link.title || link.type || 'Link'}</h4>
                          {link.url.match(/\.(mp4|webm|ogg)$/i) || link.url.includes('cloudinary.com/video') ? (
                            <video width="100%" controls style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                              <source src={link.url} />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <a href={link.url} target="_blank" rel="noreferrer" className="tp-btn">Open {link.title || link.type || 'Link'}</a>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* review */}
          <div className="tab-pane fade" id="nav-review" role="tabpanel" aria-labelledby="nav-review-tab" tabIndex="-1">
            <div className="tp-product-details-review-wrapper pt-60">
              <div className="row">
                <div className="col-lg-6">
                  <div className="tp-product-details-review-statics">

                    {/* reviews */}
                    <div className="tp-product-details-review-list pr-110">
                      <h3 className="tp-product-details-review-title">Rating & Review</h3>
                      {(!reviews || reviews.length === 0) && <h3 className="tp-product-details-review-title">
                        There are no reviews yet.
                      </h3>}
                      {reviews && reviews.length > 0 && reviews.map(item => (
                        <ReviewItem key={item._id} review={item} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="tp-product-details-review-form">
                    <h3 className="tp-product-details-review-form-title">Review this product</h3>
                    <p>Your email address will not be published. Required fields are marked *</p>
                    {/* form start */}
                    <ReviewForm product_id={_id} />
                    {/* form end */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsTabNav;
