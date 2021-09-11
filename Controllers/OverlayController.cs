using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using OBSReactScenes.Notifications;

namespace OBSReactScenes.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class OverlayController : ControllerBase
    {
        private IHubContext<OverlayHub> _hubContext;
        private readonly ILogger<OverlayController> _logger;

        public OverlayController(IHubContext<OverlayHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpGet]
        public IActionResult Get(string color)
        {
            string someColor = color;

            // send the goodness to change the overlay color

            return Ok();
        }

        // TODO: This isn't going to work currently. However,
        // if we want to get something like this set up and working again,
        // we'll likely need to implement something along the lines of 
        // https://stackoverflow.com/questions/52261260/react-dynamic-themes
        [HttpGet]
        public IActionResult Primary([FromQuery(Name = "color")] string color)
        {
            try
            {
                if (string.IsNullOrEmpty(color))
                {
                    return Ok("Hm... That didn't seem to work. Try '!accent 00ff00'");
                }
                else if (!color.StartsWith('#'))
                {
                    color = color.Insert(0, "#");
                }
                else
                {
                    return Ok("Hmm.. try again but without the '#'");
                }

                // Get the color
                Color color1 = ColorTranslator.FromHtml(color);
                Color color2 = ChangeColorBrightness(color1, -0.3f);

                _hubContext.Clients.All.SendAsync("PrimaryColor", ColorTranslator.ToHtml(color1), ColorTranslator.ToHtml(color2));

                return Ok("Adjusting Primary!");
            }
            catch (Exception e)
            {
                return Ok("Hmm... Something went wrong...");
            }
        }

        [HttpGet]
        public IActionResult Accent([FromQuery(Name = "color")] string color)
        {
            try
            {
                if (string.IsNullOrEmpty(color))
                {
                    return Ok("Hm... That didn't seem to work. Try '!accent 00ff00'");
                }
                else if (!color.StartsWith('#'))
                {
                    color = color.Insert(0, "#");
                }
                else
                {
                    return Ok("Hmm... that didn't seem to work. Ex: !accent 00ff00");
                }

                // Get the color
                Color color1 = ColorTranslator.FromHtml(color);
                Color color2 = ChangeColorBrightness(color1, -0.3f);

                _hubContext.Clients.All.SendAsync("AccentColor", ColorTranslator.ToHtml(color1), ColorTranslator.ToHtml(color2));

                return Ok("Adjusting Accent!");
            }
            catch (Exception ex)
            {
                return Ok("Hmm... Something went wrong...");
            }
        }


        public static Color ChangeColorBrightness(Color color, float correctionFactor)
        {
            float red = (float)color.R;
            float green = (float)color.G;
            float blue = (float)color.B;

            if (correctionFactor < 0)
            {
                correctionFactor = 1 + correctionFactor;
                red *= correctionFactor;
                green *= correctionFactor;
                blue *= correctionFactor;
            }
            else
            {
                red = (255 - red) * correctionFactor + red;
                green = (255 - green) * correctionFactor + green;
                blue = (255 - blue) * correctionFactor + blue;
            }


            return Color.FromArgb(color.A, (int)red, (int)green, (int)blue);
        }
    }
}
