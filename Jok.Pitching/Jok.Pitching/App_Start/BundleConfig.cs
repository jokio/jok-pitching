using System.Configuration;
using System.Web;
using System.Web.Optimization;

namespace Jok.Pitching
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.UseCdn = true;

            bundles.Add(new ScriptBundle("~/bundles/js", ConfigurationManager.AppSettings["SiteUrl"] + "bundles/js").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui-{version}.js",
                        "~/Scripts/kinetic-v5.0.1.min.js",
                        "~/Scripts/Game.js"));

            bundles.Add(new StyleBundle("~/Content/css", ConfigurationManager.AppSettings["SiteUrl"] + "Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
        }
    }
}
