using System;
using System.Device.Location;
using System.Threading;
using ElectronCgi.DotNet;

namespace DotNetLocation
{
    class Program
    {
        public static GeoCoordinateWatcher Watcher { get; private set; }

        static void Main(string[] args)
        {

            int counter = 0;

            GeoCoordinateWatcher watcher = new GeoCoordinateWatcher();
            watcher.TryStart(false, TimeSpan.FromMilliseconds(1000));

            Kordinat_Bul:

            GeoCoordinate coord = watcher.Position.Location;

            if (coord.IsUnknown != true)
            {
                sendLocation($"{coord.Latitude}-{coord.Longitude}-{coord.Altitude}-{coord.HorizontalAccuracy}-{coord.VerticalAccuracy}");
            }
            else
            {
                counter+= 1;
                if(counter <= 100000000)
                    goto Kordinat_Bul;
                else
                {
                    sendLocation("no_location");
                }
            }

        }

        static void sendLocation(string data)
        {
            Connection connection = new ConnectionBuilder()
               .WithLogging()
               .Build();

            connection.On<string, string>("find-location", (a) => {
                return data;
            });
            connection.Listen();
        }
    }
}
