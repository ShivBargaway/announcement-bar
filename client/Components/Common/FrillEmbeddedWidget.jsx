import React, { memo, useContext, useEffect } from "react";
import { Button, ButtonGroup } from "@shopify/polaris";
import { ProfileContext } from "@/Context/ProfileContext";

const FrillWidget = memo(({ widgetKey, label, selector, frame, buttonProps }) => {
  const { profileData } = useContext(ProfileContext);
  useEffect(() => {
    if (!profileData?.frillSSOToken) return;

    (function (t, r) {
      function s() {
        var a = r.getElementsByTagName("script")[0],
          e = r.createElement("script");
        (e.type = "text/javascript"),
          (e.async = !0),
          (e.src = "https://widget.frill.co/v2/container.js"),
          (e.onload = function () {
            window.Frill("container", {
              key: widgetKey,
              ssoToken: profileData?.frillSSOToken,
            });
          });
        a.parentNode.insertBefore(e, a);
      }
      if (!t.Frill) {
        var o = 0,
          i = {};
        (t.Frill = function (e, p) {
          var n,
            l = o++,
            c = new Promise(function (v, d) {
              i[l] = {
                params: [e, p],
                resolve: function (f) {
                  (n = f), v(f);
                },
                reject: d,
              };
            });
          return (
            (c.destroy = function () {
              delete i[l], n && n.destroy();
            }),
            c
          );
        }),
          (t.Frill.q = i);
      }
      r.readyState === "complete" || r.readyState === "interactive"
        ? s()
        : r.addEventListener("DOMContentLoaded", s);
    })(window, document);
  }, [profileData]);

  if (frame) {
    return <></>;
  }
  return (
    <ButtonGroup>
      <div className={selector}>
        <Button {...buttonProps}>{label}</Button>
      </div>
    </ButtonGroup>
  );
});

export default FrillWidget;
