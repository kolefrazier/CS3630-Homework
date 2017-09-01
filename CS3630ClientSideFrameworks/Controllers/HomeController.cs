using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CS3630ClientSideFrameworks.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        //Static HTML page in wwwroot/assignments/ directory.
        //public IActionResult Assignment1()
        //{
        //    return View();
        //}

        public IActionResult Error()
        {
            return View();
        }
    }
}
