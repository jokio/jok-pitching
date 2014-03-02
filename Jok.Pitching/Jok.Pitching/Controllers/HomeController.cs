using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jok.Pitching.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Play(string deviceid)
        {
            ViewBag.DeviceID = deviceid;

            return View();
        }

        public ActionResult Play2(string deviceid)
        {
            ViewBag.DeviceID = deviceid;

            return View();
        }
    }
}